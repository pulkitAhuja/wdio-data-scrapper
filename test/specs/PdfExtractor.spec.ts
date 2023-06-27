import * as fs from 'fs';
import pdfParseFixed from '@cyber2024/pdf-parse-fixed';
import * as path from 'path';

// @ts-ignore
function readFiles(dir, processFile) {
    // read directory
    fs.readdir(dir, (error, fileNames) => {
        if (error) throw error;

        fileNames.forEach(filename => {
            // get current file name
            const name = path.parse(filename).name;
            // get current file extension
            const ext = path.parse(filename).ext;
            // get current file path
            const filepath = path.resolve(dir, filename);

            // get information about the file
            fs.stat(filepath, function (error, stat) {
                if (error) throw error;

                // check if the current path is a file or a folder
                const isFile = stat.isFile();

                // exclude folders
                if (isFile) {
                    // callback, do something with the file
                    processFile(filepath, name, ext, stat);
                }
            });
        });
    });
}

describe('Data-Scraping', () => {
    let allLinks: any = [];
    it('Traverse PDFs and extract data', async () => {
        // @ts-ignore
        readFiles('/Users/p.ahuja/personal-git/jasmine-boilerplate/pdfs', (filepath, name, ext, stat) => {

                console.log('file path:', filepath);
                console.log('file name:', name);
                console.log('file ext:', ext);
                let dataBuffer = fs.readFileSync(filepath, stat);

                if (ext === '.pdf') {
                    pdfParseFixed(dataBuffer).then(function (data) {
                        try {
                            let txtFile = "scrappedData/scrappedPdfs/scrapped-" + name + ".txt";
                            fs.appendFile(txtFile, data.text, function (err) {
                                if (err) throw err;
                                console.log('Saved!');
                            });
                        } catch (e) {
                            console.log(e);
                        }
                    });
                }

            }
        );

    })
})
