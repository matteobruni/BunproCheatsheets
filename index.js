import fs from 'fs/promises';
import path from 'path';
import { marked } from 'marked';

const markdownFolderPath = './Markdown'; // Change this to your actual markdown folder path
const jsonOutputFolderPath = './JSON'; // Change this to your desired json output folder path

async function convertMarkdownToJson(markdownFilePath, jsonOutputPath) {
    try {
        const data = await fs.readFile(markdownFilePath, 'utf8');

        // Parse the Markdown file
        const tokens = marked.lexer(data);
        let tableData = [];
        let insideTable = false;
        let header = [];

        // Process the tokens to find and parse the table
        for (const token of tokens) {
            if (token.type === 'table') {
                insideTable = true;
                header = token.header.map(h => h.text.trim());
                for (const row of token.rows) {
                    let rowData = {};
                    for (let i = 0; i < row.length; i++) {
                        rowData[header[i]] = row[i].text.trim();
                    }
                    tableData.push(rowData);
                }
            } else if (insideTable && token.type !== 'table') {
                // Exit after the first table is processed
                break;
            }
        }

        // Write the JSON file
        await fs.writeFile(jsonOutputPath, JSON.stringify(tableData, null, 2));
        console.log(`JSON file has been created successfully: ${jsonOutputPath}`);
    } catch (err) {
        console.error(`Error processing file ${markdownFilePath}:`, err);
    }
}

async function processAllMarkdownFiles() {
    try {
        const files = await fs.readdir(markdownFolderPath);

        await fs.mkdir(jsonOutputFolderPath, { recursive: true });

        for (const file of files) {
            const extname = path.extname(file);
            if (extname === '.md') {
                const markdownFilePath = path.join(markdownFolderPath, file);
                const jsonFileName = path.basename(file, extname) + '.json';
                const jsonOutputPath = path.join(jsonOutputFolderPath, jsonFileName);
                await convertMarkdownToJson(markdownFilePath, jsonOutputPath);
            }
        }
    } catch (err) {
        console.error('Error processing files:', err);
    }
}

processAllMarkdownFiles();
