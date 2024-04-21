"use client";
import { jsPDF } from "jspdf";
import { useEffect } from "react";
import "jspdf-autotable";


// // Default export is a4 paper, portrait, using millimeters for units
// const MyPDFdoc = ({generatePDF, orderNumber, matchTime,receiptGenerated,stableCrypto,coinTraded,currency,totalCrypto,cryptoPrice,totalTradedAmount,orderDate,paymentType,paymentMethod,paymentDetails})=>{
//     // useEffect(()=>{
//     //     const doc = new jsPDF();
//     //     doc.text("asasasasasa!", 10, 10);
//     //     doc .text("wwqwqwqwqwqwqwqwqwqw!", 30, 10);
//     //     doc.save("a4.pdf");
//     // },[generatePDF])
//     return (<>
//     <div>
//         <button onClick={() => {
//             if(typeof window !== 'undefined'){
//                 const doc = new jsPDF();

//                 const orderNumber = '20612131391302512640'
//                 const matchTime = ' 2024-04-12 15:58:20(UTC)'
//                 const receiptGenerated= "KAZZE COMMUNICATIONS PRIVATE LIMITED"
//                 const stableCrypto ="Stable Crypto"
//                 const coinTraded = "USDT"
//                 const currency = "INR"
//                 const totalCrypto = "0.000"
//                 const cryptoPrice = "0.00"
//                 const totalTradedAmount = "0.00"
//                 const orderDate = "09/02/2024"
//                 const paymentType = "Outward"
//                 const paymentMethod = "Bank transfer"
//                 const paymentDetails = "Success"
                 
//                 const imgData =
//                 'data:image/png;base64,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';

//                  doc.addImage(imgData, 'PNG', 65, 0, 60, 30);

//                 doc.text(`Order Number: ${orderNumber}`, 10, 35);   
//                 doc.text(`Match Time: : ${matchTime}`, 10, 45);
//                 doc.text(`Receipt Generated For:`, 10, 60);
//                 doc.text(`${receiptGenerated}`, 10, 70);
//                 doc.text(`User Side: MAKER_BUYER`,10, 80);
//                 doc.text(`Trade with:`,10, 95);
//                 doc.text(`${stableCrypto}`,10, 105);  
//                 doc.text(`User Side: MAKER_SELLER`,10, 115);
//                 doc.text(`Trade Details`, 10, 130);
// //table 1
//                 // const columns = ["Item Name", "Total"];
//         const rows = [
//             ["Crypto (COIN) traded",`${coinTraded}`],
//             ["Fiat Involved in the trade", `${currency}`],
//             ["Total Amount of Crypto", `${totalCrypto}`],
//             ["Crypto Unit Price in Fiat",`${cryptoPrice}`],
//             ["Total Traded Amount in Fiat", `${totalTradedAmount}`],
//             ["Order Completed Date", `${orderDate}`]
//         ];
//                     // Check if there are rows to add to the table
//                     if (rows.length > 0) {
//                         // Generate the table
//                         doc.autoTable({
//                           startY: 140,
//                         //   head: [columns],
//                           body: rows,
//                         });
//                       }
        
//                       doc.text(`Trade Payment Details`, 10, 205);

// //table 2
//                          // const columns = ["Item Name", "Total"];
//         const rows2 = [
//             ["Payment Type", `${paymentType}`],
//             ["Payment Method",`${paymentMethod}`],
//             ["Payment Details", `${paymentDetails}`],
          
//         ];
//                     // Check if there are rows2 to add to the table
//                     if (rows2.length > 0) {
//                         // Generate the table
//                         doc.autoTable({
//                           startY: 210,
//                         //   head: [columns],
//                           body: rows2,
//                         });
//                       }

//                       doc.text(`Receipt Generated Time: 2024-04-18 08:46:12(UTC)`, 10, 260);
//                       doc.text(` This is a system generated receipt`, 10, 270);

//                 document
//                 .getElementById("main-iframe")
//                 .setAttribute("src", doc.output("bloburl"));



          
//             }
//         // doc.save("a4.pdf");
//         }} style={{color:"white",backgroundColor:"black", borderRadius:"5px", border:"grey solid 2px", padding:"5px"}}>Refresh</button>
//         <iframe
//           id="main-iframe"
//           style={{
//             width: "100%",
//             height: "80vh",
//             border: "none",
//           }}
//         >
//           hi
//         </iframe>
//         </div></>)
// }

// export default MyPDFdoc

//----------------------------------------------------------------------------------------------------------------------------
export function generatePDF(orderNumber, matchTime,receiptGenerated,stableCrypto,coinTraded,currency,totalCrypto,cryptoPrice,totalTradedAmount,orderDate,paymentType,paymentMethod,paymentDetails){

    const doc = new jsPDF();

    const imgData =
    'data:image/png;base64,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';

     doc.addImage(imgData, 'PNG', 65, 0, 60, 30);

    doc.text(`Order Number: ${orderNumber}`, 10, 35);   
    doc.text(`Match Time: : ${matchTime}`, 10, 45);
    doc.text(`Receipt Generated For:`, 10, 60);
    doc.text(`${receiptGenerated}`, 10, 70);
    doc.text(`User Side: MAKER_BUYER`,10, 80);
    doc.text(`Trade with:`,10, 95);
    doc.text(`${stableCrypto}`,10, 105);  
    doc.text(`User Side: MAKER_SELLER`,10, 115);
    doc.text(`Trade Details`, 10, 130);
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
              startY: 140,
            //   head: [columns],
              body: rows,
            });
          }

          doc.text(`Trade Payment Details`, 10, 205);

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
              startY: 210,
            //   head: [columns],
              body: rows2,
            });
          }

          doc.text(`Receipt Generated Time: 2024-04-18 08:46:12(UTC)`, 10, 260);
          doc.text(` This is a system generated receipt`, 10, 270);

          doc.save("invoice.pdf")

}