// ExcelImport.js
import React, { useState,useEffect } from 'react';
import ExcelJS from 'exceljs';
import SuccessModal from "./SuccessModal";
import axios from 'axios';

const ExcelImport = ({ onTableDataChange,tableData:tableprop, file }) => {
  const [tableData, setTableData] = useState([]);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [fileData, setFileData] = useState([]);

  const handleCloseSuccessModal = () => {
    setIsSuccessModalOpen(false); // Close the modal
  };

  useEffect(() => {
    if (tableprop) {

      setTableData(tableprop);
    }
  }, [tableprop]);


  useEffect(() => {
    if (file) {

      ReadExcel(file);

    }
  }, [file]);



  const ReadExcel = async (filename) => {
    try {
      console.log("Filename:", filename);
      const apiUrl = `${process.env.NEXT_PUBLIC_URL}api/getExcelFile?filename=${filename}`;
  
      const response = await fetch(apiUrl, { method: "GET" });
  
      if (response.status === 200) {
        const fileData = await response.json();
         
        // Process the file data as needed
        console.log('File contents:', fileData.data);
        const filteredArray=fileData.data.filter(item => {
          // Check if item is an object and not an array, and has keys
          return typeof item === 'object' && item !== null && !Array.isArray(item) && Object.keys(item).length > 0;
        });
        setFileData(filteredArray);  // Assuming setFileData is a state setter function
      } else {
        console.error('Error with response:', response);
        setError('An error occurred while retrieving the file.');
      }
    } catch (error) {
      console.error('Error retrieving file:', error);
      setError('An error occurred while retrieving the file.');
    }
  };
  
  


  const importExcel = async (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
  
    reader.onload = async (event) => {
      const arrayBuffer = event.target.result;
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(arrayBuffer);
      const worksheet = workbook.getWorksheet(1);
  
      // Process your Excel data from 'worksheet' here...
      // For example, to get an array of rows, you can do:
      const fileData = [];
      worksheet.eachRow({ includeEmpty: false }, (row) => {
        fileData.push(row.values);
      });
  
      // Find the header row index
      const headerRowIndex = fileData.findIndex(row =>
        row.includes('name') && row.includes('email') && row.includes('company') && row.includes('other')
      );
  
      if (headerRowIndex !== -1) {
        const headers = fileData[headerRowIndex];
        const nameIndex = headers.indexOf('name');
        const emailIndex = headers.indexOf('email');
        const companyIndex = headers.indexOf('company');
        const otherIndex = headers.indexOf('other');
  
        // Filter out rows that don't have both "name" and "email"
        const filteredData = fileData
          .slice(headerRowIndex + 1) // Skip the header row
          .filter(row => row[nameIndex] && row[emailIndex] && row[companyIndex] && row[otherIndex]) // Filter out empty rows
          .map(row => ({
            name: row[nameIndex],
            email: row[emailIndex],
            company: row[companyIndex],
            other: row[otherIndex],
          }));
          const updatedData = filteredData.map(item => ({
            ...item,
            email: item.email.text, // Update the email property
          }));
          console.log(updatedData)
        // Upload the file to the server
        try {
          const formData = new FormData();
          console.log(file);
          formData.append('ExcelFile', file);
  
          const entries = formData.entries();
          console.log("form");
          for (const entry of entries) {
            console.log(entry[0], entry[1]);
          }
          const response = await axios.post('/api/uploadexcel', formData);
  
          if (response.status === 200) {
            // File uploaded successfully
            // Set the file path in the parent component
            onTableDataChange(updatedData, response.data.filename);
            //console.log(updatedData[0].email.text) // Pass the file path to the parent
            setTableData(updatedData);
            e.target.value = '';
            console.log("tabledata",tableData)
            setSuccessMessage('File Uploaded successfully.');
            setIsSuccessModalOpen(true);
            console.log("hello")
          } else {
            console.error('Error:', response.data);
            setError('An error occurred while uploading the file.');
          }
        } catch (error) {
          console.error('Error uploading file:', error);
          setError('An error occurred while uploading the file.');
        }
      } else {
        setError('Columns not found in the Excel file.');
      }
    };
  
    reader.readAsArrayBuffer(file);
  };
  
  const renderTableRowsFile = (data) => {
    if (data.length === 0) return null;
    const columns = Object.keys(data[0]);

    return (
      <table className="min-w-[420px] w-full text-left text-xs text-slate-100">
        <thead className="bg-white/5 text-[11px] uppercase tracking-wide text-slate-300">
          <tr>
            {columns.map((header, headerIndex) => (
              <th key={headerIndex} className="px-3 py-2">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-white/5">
              {columns.map((columnName, cellIndex) => {
                const cellValue = row[columnName];
                let displayValue;

                if (cellValue && typeof cellValue === "object") {
                  displayValue =
                    Object.keys(cellValue).length === 0
                      ? ""
                      : cellValue.text || "";
                } else {
                  displayValue = cellValue ?? "";
                }

                return (
                  <td
                    key={`${rowIndex}-${cellIndex}`}
                    className="px-3 py-2 text-[11px] text-slate-200"
                  >
                    {displayValue}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };
  
  

  

  
  return (
    <div className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-slate-50 shadow-2xl backdrop-blur">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">Leads</p>
          <p className="text-sm text-slate-200">Upload an .xlsx with columns: name, email, company, other.</p>
        </div>
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm font-semibold">
          <span>Choose file</span>
          <input type="file" accept=".xlsx" onChange={importExcel} className="hidden" />
        </label>
      </div>

      {tableData.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-white/10 bg-white/5">
          <table className="min-w-[420px] w-full text-left text-xs text-slate-100">
            <thead className="bg-white/5 text-[11px] uppercase tracking-wide text-slate-300">
              <tr>
                {Object.keys(tableData[0]).map((header, headerIndex) => (
                  <th key={headerIndex} className="px-3 py-2">
                    {header.charAt(0).toUpperCase() + header.slice(1)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {tableData.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-white/5">
                  <td className="px-3 py-2">{row.name}</td>
                  <td className="px-3 py-2 break-all font-mono text-[11px] text-slate-300">{row.email}</td>
                  <td className="px-3 py-2">{row.company}</td>
                  <td className="px-3 py-2">{row.other}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {fileData.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-white/10 bg-white/5 p-3">
          {renderTableRowsFile(fileData.slice(1))}
        </div>
      )}

      {error && <p className="text-sm text-rose-200">{error}</p>}

      {isSuccessModalOpen && (
        <SuccessModal SuccessMessage={successMessage} onClose={handleCloseSuccessModal} />
      )}
    </div>
  );
  
};

export default ExcelImport;
