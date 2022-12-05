import { LightningElement } from 'lwc';
import { loadScript } from 'lightning/platformResourceLoader';
import jsPDF from "@salesforce/resourceUrl/B2_jsPDF";
import bwipjs from "@salesforce/resourceUrl/B2_bwipp_js";

 
export default class B2_pdfExporter extends LightningElement {
    
    jsPdfInitialized = false;
	bwipInitialized = false;

	//Modules initializing
    renderedCallback(){
        if (!this.jsPdfInitialized) {
			this.jsPdfInitialized = true;
			Promise.all([
				loadScript(this, jsPDF + '/dist/jspdf.umd.min.js')
			]).then(() => {
				console.log('jsPDF loaded');
			})
			.catch((error) => {
				console.log('jsPDF loading error: '+error);
			});
        }

		if(!this.bwipInitialized){
			this.bwipInitialized = true;
			Promise.all([
				loadScript(this, bwipjs + '/dist/bwip-js.js')
			]).then(() => {
				console.log('bwip loaded');
			})
			.catch((error) => {
				console.log('bwip loading error: '+error);
			});
		}
    }

	//data getters to be replaced
	getDataMatrixString(){
		return "This is a test.";
	}

	getPDFData(){
		const pdfData = [];
		pdfData.push("Test line 1", "Test line 2", "Another test line");
		return pdfData;
	}

    createPDFHandler() {

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
		let fileName = "test PDF";
		let pdfText = this.getPDFData();
		let dataMatrixString = this.getDataMatrixString();
		
		//Build Data Matrix
		let matrixCanvas = document.createElement('canvas');
		window.bwipjs.toCanvas(matrixCanvas, {
			bcid:        'datamatrix',        
			text:        dataMatrixString,    
			scale:       1,               	  
			height:      1             	  
		});

		//Build PDF file
		let maxTextSize = 0;
		for(let line = 0; line < pdfText.length; line++){
			let currentLength = pdfText[line].length;
			if(currentLength > maxTextSize){
				maxTextSize = currentLength;
			}
			doc.text(pdfText[line], 10, 5+10*(line+1));
		}
		doc.addImage(matrixCanvas, 'PNG', maxTextSize*3+20, 10, 25, 25);
		
		//Trigger download
        doc.save(fileName);
    }
    
}