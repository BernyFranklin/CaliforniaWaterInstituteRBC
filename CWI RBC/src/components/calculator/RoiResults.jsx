import { useRef } from 'react';
import CalculationDataSection from '../CalculationDataSection.jsx';
import OutputsDataSection from '../OutputsDataSection.jsx';
import ReturnOnInvestmentTable from '../ReturnOnInvestmentTable.jsx';
import Button from '../Button.jsx';

export default function RoiResults({ formData }) {
  const resultsRef = useRef();

  const exportToPDF = async (event) => {
    // Prevent form submission and page reload
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    console.log('Export to PDF clicked'); // Debug log
    
    try {
      // Check if packages are installed
      let html2canvas, jsPDF;
      
      try {
        html2canvas = (await import('html2canvas')).default;
        jsPDF = (await import('jspdf')).jsPDF;
      } 
      catch (importError) {
        alert('PDF export libraries not found. Please install by running: npm install jspdf html2canvas');
        console.error('Missing PDF libraries. Run: npm install jspdf html2canvas', importError);
        return;
      }

      const element = resultsRef.current;
      
      
      if (!element) {
        console.error('Results element not found');
        alert('Unable to find results content to export');
        return;
      }
      
      // Add a temporary class for PDF-specific styling
      element.classList.add('pdf-export');
      
      
      
      // Configure html2canvas options for better quality
      const canvas = await html2canvas(element, {
        scale: 2, // Higher quality
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: element.scrollWidth,
        height: element.scrollHeight,
      });

      // Remove the temporary class
      element.classList.remove('pdf-export');

      const imgData = canvas.toDataURL('image/png');
      
      // Create PDF in landscape if content is wide, portrait otherwise
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const margin = 20;
      const contentWidth = pageWidth - (2 * margin);
      const contentHeight = pageHeight - 60; // Leave space for title and margin
      
      // Calculate the scale to fit content properly
      const canvasAspectRatio = canvas.width / canvas.height;
      const contentAspectRatio = contentWidth / contentHeight;
      
      let imgWidth, imgHeight;
      
      if (canvasAspectRatio > contentAspectRatio) {
        // Content is wider, scale by width
        imgWidth = contentWidth;
        imgHeight = contentWidth / canvasAspectRatio;
      } else {
        // Content is taller, scale by height
        imgHeight = contentHeight;
        imgWidth = contentHeight * canvasAspectRatio;
      }
      
      // Add title
      pdf.setFontSize(16);
      pdf.text('Recharge Basin Calculator Results', margin, 25);
      
      // Add timestamp
      pdf.setFontSize(10);
      pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, margin, 35);
      
      // Add the image - if it fits on one page, use one page, otherwise scale to fit
      if (imgHeight <= contentHeight) {
        // Fits on one page
        const xPosition = margin + (contentWidth - imgWidth) / 2; // Center horizontally
        pdf.addImage(imgData, 'PNG', xPosition, 45, imgWidth, imgHeight);
      } else {
        // Scale down to fit on one page
        const scaleFactor = contentHeight / imgHeight;
        const scaledWidth = imgWidth * scaleFactor;
        const scaledHeight = contentHeight;
        const xPosition = margin + (contentWidth - scaledWidth) / 2; // Center horizontally
        
        pdf.addImage(imgData, 'PNG', xPosition, 45, scaledWidth, scaledHeight);
      }

      // Save the PDF
      const fileName = `recharge-basin-results-${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
      
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      alert('Failed to generate PDF. Please try again. Check console for details.');
    }
  };

  const styles = {
    container: {
      fontFamily: 'inherit',
      backgroundColor: '#fff',
      color: '#000',
      padding: '0 1rem',
      textAlign: 'center',
      margin: 0,
      minHeight: '100vh',
    },
    exportButton: {
      margin: '2rem auto',
      textAlign: 'center',
    },
  };

  return (
    <>
      <div className="roi-results" id="roi-results-section" style={styles.container}>
        <div ref={resultsRef}>
          <CalculationDataSection formData={formData} />
          <OutputsDataSection formData={formData} />
          <ReturnOnInvestmentTable formData={formData} />
        </div>
        <div style={styles.exportButton}>
          <Button 
            className="red-button" 
            text="📄 Export to PDF" 
            onClick={exportToPDF}
          />
        </div>
      </div>
    </>
  );
}
