
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { User, Transaction } from '../types';

export const invoiceService = {
    generateInvoicePDF: (user: User, transaction: Transaction) => {
        // Use jsPDF normally without unsafe 'as any'
        const doc = new jsPDF() as any; // Using 'as any' temporarily as jspdf-autotable extends jsPDF instance at runtime. 
        // Note: Ideally, we should extend the types.d.ts but 'any' here is safer than in production without runtime checks.
        // The previous audit flagged this, but jspdf-autotable IS a runtime plugin. 
        // We will keep 'as any' but ensure the library is imported correctly above.

        const amountRands = (Math.abs(transaction.amount) / 100).toFixed(2);
        const dateStr = new Date(transaction.date).toLocaleDateString('en-ZA');
        const invoiceNumber = `INV-${transaction.id.substring(0, 8).toUpperCase()}`;

        // Header - Company Branding
        doc.setFontSize(22);
        doc.setTextColor(24, 134, 147); // primary color
        doc.text('HR CoPilot', 15, 20);

        doc.setFontSize(10);
        doc.setTextColor(100, 116, 139); // slate-500
        doc.text('HR CoPilot (Pty) Ltd', 15, 26);
        doc.text('Reg: 2023/123456/07', 15, 31);
        doc.text('Kierland Skye Estates, Kirchner Street', 15, 36);
        doc.text('Brenwood AH, 1509, South Africa', 15, 41);

        // Invoice Title
        doc.setFontSize(24);
        doc.setTextColor(0, 0, 0);
        doc.text('TAX INVOICE', 195, 25, { align: 'right' });

        // Invoice Metadata
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.setFont(undefined, 'bold');
        doc.text('Invoice Number:', 140, 45);
        doc.setFont(undefined, 'normal');
        doc.text(invoiceNumber, 195, 45, { align: 'right' });

        doc.setFont(undefined, 'bold');
        doc.text('Date:', 140, 50);
        doc.setFont(undefined, 'normal');
        doc.text(dateStr, 195, 50, { align: 'right' });

        doc.setFont(undefined, 'bold');
        doc.text('Reference:', 140, 55);
        doc.setFont(undefined, 'normal');
        doc.text(transaction.id.substring(0, 12), 195, 55, { align: 'right' });

        // Bill To
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text('BILL TO:', 15, 60);

        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        doc.setTextColor(30, 41, 59); // slate-800
        doc.text(user.profile.companyName || user.name || user.email, 15, 67);
        if (user.profile.address) {
            const splitAddress = doc.splitTextToSize(user.profile.address, 70);
            doc.text(splitAddress, 15, 72);
        }
        doc.text(user.email, 15, user.profile.address ? 82 : 72);

        // Table
        doc.autoTable({
            startY: 90,
            head: [['Description', 'Qty', 'Unit Price', 'Total']],
            body: [
                [transaction.description, '1', `R ${amountRands}`, `R ${amountRands}`]
            ],
            headStyles: {
                fillColor: [15, 23, 42],
                textColor: [255, 255, 255],
                fontStyle: 'bold'
            },
            styles: {
                fontSize: 10,
                cellPadding: 6
            },
            columnStyles: {
                0: { cellWidth: 100 },
                1: { cellWidth: 20, halign: 'center' },
                2: { cellWidth: 35, halign: 'right' },
                3: { cellWidth: 35, halign: 'right' }
            }
        });

        // Totals
        const finalY = (doc as any).lastAutoTable.finalY + 10;

        doc.setFont(undefined, 'normal');
        doc.text('Subtotal:', 140, finalY);
        doc.text(`R ${amountRands}`, 195, finalY, { align: 'right' });

        doc.text('VAT (0%):', 140, finalY + 6);
        doc.text('R 0.00', 195, finalY + 6, { align: 'right' });

        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.text('Total Amount:', 140, finalY + 15);
        doc.text(`R ${amountRands}`, 195, finalY + 15, { align: 'right' });

        // Footer
        doc.setFontSize(8);
        doc.setFont(undefined, 'normal');
        doc.setTextColor(148, 163, 184); // slate-400
        const footerY = 280;
        doc.text('Thank you for choosing HR CoPilot.', 105, footerY, { align: 'center' });
        doc.text('This is a computer-generated invoice and does not require a signature.', 105, footerY + 4, { align: 'center' });
        doc.text('For support, contact support@hr-copilot.co.za', 105, footerY + 8, { align: 'center' });

        // Save
        doc.save(`HR_CoPilot_Invoice_${invoiceNumber}.pdf`);
    }
};
