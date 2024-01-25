import path from 'path';
import fs from 'fs';
import { parse } from 'url';
import ExcelJS from 'exceljs'; // Import exceljs

const uploadDir = path.join(process.cwd(), 'public/uploads');

export default async (req, res) => {
  try {
    const { query } = parse(req.url, true);
    const { filename } = query;

    if (!filename) {
      res.status(400).json({ message: 'No filename provided.' });
      return;
    }

    // Construct the full file path based on the filename and the upload directory
    const filePath = path.join(uploadDir, filename);

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      res.status(404).json({ message: 'File not found.' });
      return;
    }

    // Read the file data
    const fileData = fs.readFileSync(filePath);

    // Create a new workbook from the file data
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(fileData);

    // Assuming you want to access the first sheet in the Excel file
    const worksheet = workbook.getWorksheet(1);

    // Convert the worksheet to an array of objects (representing rows)
    const jsonData = [];
    worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
      const rowData = {};
      row.eachCell((cell, colNumber) => {
        rowData[`column${colNumber}`] = cell.value;
      });
      jsonData.push(rowData);
    });

    console.log(jsonData);

    // Send the parsed data in the response
    res.status(200).json({ message: 'File retrieved successfully.', data: jsonData });
  } catch (error) {
    console.error('Error retrieving file:', error);
    res.status(500).json({ message: 'An error occurred while retrieving the file.' });
  }
};
