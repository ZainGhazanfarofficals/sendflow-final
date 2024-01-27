import fetch from 'node-fetch'; // Import node-fetch to handle HTTP requests
import ExcelJS from 'exceljs'; // Import ExcelJS for handling Excel files
import { parse } from 'url'; // Import parse from 'url' module for parsing request URLs

export default async (req, res) => {
  try {
    const { query } = parse(req.url, true);
    const { filename } = query;

    if (!filename) {
      res.status(400).json({ message: 'No filename provided.' });
      return;
    }
   console.log(filename);
    // Construct the Cloudinary URL for the file
    const cloudinaryUrl = `https://res.cloudinary.com/dpkkaacjk/raw/upload/uploads/${filename}`;

    // Fetch the file data from Cloudinary
    const response = await fetch(cloudinaryUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const fileData = await response.buffer();

    // Create a new workbook from the file data
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(fileData);

    // Assuming you want to access the first sheet in the Excel file
    const worksheet = workbook.getWorksheet(1);

    // Convert the worksheet to an array of objects (representing rows)
    const jsonData = [];
    worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
      const rowData = {};
      row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
        rowData[`column${colNumber}`] = cell.value;
      });
      jsonData.push(rowData);
    });

    // Send the parsed data in the response
    res.status(200).json({ message: 'File retrieved successfully.', data: jsonData });
  } catch (error) {
    console.error('Error retrieving file:', error);
    res.status(500).json({ message: 'An error occurred while retrieving the file.' });
  }
};
