import { useState, useEffect } from 'react';
import { Container, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import axios from 'axios';

function App() {
    const [files, setFiles] = useState([]);
    const [data, setData] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        fetchFiles();
    }, []);

    const fetchFiles = async () => {
        try {
            const response = await axios.get('/json/list.json'); // Relative URL
            setFiles(response.data);
        } catch (error) {
            console.error('Error fetching files:', error);
        }
    };

    const fetchData = async (fileName) => {
        try {
            const response = await axios.get(`/json/${fileName}`); // Relative URL
            setData(response.data);
            setSelectedFile(fileName);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <Container>
            <style>
                {`
                    @media print {
                        body * {
                            visibility: hidden;
                        }
                        #printableArea, #printableArea * {
                            visibility: visible;
                        }
                        #printableArea {
                            position: absolute;
                            left: 0;
                            top: 0;
                        }
                    }
                `}
            </style>
            <Typography variant="h4" gutterBottom>
                Bunpro Printable Cheatsheets
            </Typography>
            <div style={{ marginTop: 20 }}>
                {files.map((file, index) => (
                    <Button
                        key={index}
                        variant="outlined"
                        onClick={() => fetchData(file)}
                        style={{ marginRight: 10, marginBottom: 10 }}
                        size="small" // Make the buttons more compact
                    >
                        {file}
                    </Button>
                ))}
            </div>
            {selectedFile && (
                <>
                    <Typography variant="h6" gutterBottom style={{ marginTop: 20 }}>
                        Data from {selectedFile}
                    </Typography>
                    <div id="printableArea">
                        <TableContainer component={Paper} style={{ marginTop: 20 }}>
                            <Table size='small'>
                                <TableHead>
                                    <TableRow>
                                        {Object.keys(data[0]).map((key) => (
                                            <TableCell key={key} sx={{ textTransform: 'capitalize', padding: '4px 8px', fontSize: '0.875rem' }}>
                                                {key}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {data.map((row, index) => (
                                        <TableRow
                                            key={index}
                                            sx={{
                                                backgroundColor: !(index % 2) ? '#f5f5f5' : 'white',
                                            }}
                                        >
                                            {Object.keys(row).map((key) => (
                                                <TableCell key={key} sx={{ padding: '4px 8px', fontSize: '0.875rem' }}>
                                                    {row[key]}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                    <Button variant="contained" color="primary" onClick={handlePrint} style={{ marginTop: 20 }}>
                        Print
                    </Button>
                </>
            )}
        </Container>
    );
}

export default App;
