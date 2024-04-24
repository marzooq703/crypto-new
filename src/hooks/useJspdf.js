import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export function generatePDF(
  orderNumber,
  matchTime,
  receiptGenerated,
  stableCrypto,
  coinTraded,
  currency,
  totalCrypto,
  cryptoPrice,
  totalTradedAmount,
  orderDate,
  paymentType,
  paymentMethod,
  paymentDetails,
  generatedTime
) {
  const doc = new jsPDF();
  const currentDate =new Date().toLocaleDateString()
const year = new Date().getFullYear();
const month = String(new Date().getMonth() + 1).padStart(2, '0');
const day = String(new Date().getDate()).padStart(2, '0');

  const imgData =
'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKAAAAA8CAMAAADWtUEnAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAtNQTFRFAAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////4izIpgAAAPF0Uk5TAAEEBwkLDhAkoPf/lFrc7DzP6QxQ/IIYgfpXFebLDcA7EyMcBg8WKUo2qwOa8nL7o3u5qadljgJY/i997sISw1mKOPBIicks2b4Fjedx/V7j1R+twU6z4N7G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';
doc.setDrawColor(0,0,0);
doc.setLineWidth(1);
doc.setFillColor(0,102,204);
doc.rect(0, 0.7, 300 ,20, 'FD');

doc.addImage(imgData, 'PNG', 83, 3, 40, 15);

const headingFontSize = 16;
doc.setFontSize(headingFontSize);

doc.text(`${receiptGenerated}`, 10, 59);
doc.text(`${stableCrypto}`,10, 90);  
doc.text(`Trade Details:`, 10, 115);
doc.text(`Trade Payment Details:`, 10, 178);


const normalFontSize = 12;
doc.setFontSize(normalFontSize);

doc.text(`Order Number: ${orderNumber}`, 10, 30);   
doc.text(`Date: ${year}-${month}-${day}`, 10, 37);
doc.text(`Receipt Generated For:`, 10, 50);

if(paymentType ==='Buy'){
  doc.text(`User Side: MAKER_BUYER`,10, 66);
}else if(paymentType==='Sell'){
doc.text(`User Side: TAKER_SELLER`,10, 66);
}



doc.text(`Trade with:`,10, 82);

if(paymentType ==='Buy'){
  doc.text(`User Side: TAKER_SELLER`,10, 97);
}else if(paymentType==='Sell'){
doc.text(`User Side: MAKER_BUYER`,10, 97);
}

//table 1
// const columns = ["Item Name", "Total"];
const rows = [
["Crypto (COIN) traded",`${coinTraded}`],
["Fiat Involved in the trade", `${currency}`],
["Total Amount of Crypto", `${totalCrypto}`],
["Crypto Unit Price in Fiat",`${cryptoPrice}`],
["Total Traded Amount in Fiat", `${totalTradedAmount}`],
["Order Completed Date", `${orderDate}`]
];
    // Check if there are rows to add to the table
    if (rows.length > 0) {
        // Generate the table
        doc.autoTable({
          startY: 118,
        //   head: [columns],
          body: rows,
        });
      }

      

//table 2
         // const columns = ["Item Name", "Total"];
const rows2 = [
["Payment Type", `${paymentType}`],
["Payment Method",`${paymentMethod}`],
["Payment Details", `${paymentDetails}`],

];
    // Check if there are rows2 to add to the table
    if (rows2.length > 0) {
        // Generate the table
        doc.autoTable({
          startY: 181,
        //   head: [columns],
          body: rows2,
        });
      }

      doc.text(`Receipt Generated Time: ${generatedTime}`, 10, 220);
      doc.text(` This is a system generated Receipt.`, 70, 235);

          doc.save("invoice.pdf")

}