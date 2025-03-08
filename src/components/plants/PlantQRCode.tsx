
import React, { useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Plant } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Printer } from "lucide-react";
import { useTranslation } from "react-i18next";

interface PlantQRCodeProps {
  plant: Plant;
  baseUrl: string;
}

const PlantQRCode = ({ plant, baseUrl }: PlantQRCodeProps) => {
  const qrCodeRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  
  const qrCodeUrl = `${baseUrl}/plant/${plant.id}`;
  
  const handlePrint = () => {
    if (!qrCodeRef.current) return;
    
    const printContent = qrCodeRef.current.innerHTML;
    const printWindow = window.open("", "_blank");
    
    if (!printWindow) {
      alert("Veuillez autoriser les popups pour imprimer le QR code");
      return;
    }
    
    printWindow.document.open();
    printWindow.document.write(`
      <html>
        <head>
          <title>QR Code - ${plant.variety.name}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              height: 100vh;
              padding: 20px;
            }
            .qr-container {
              display: flex;
              flex-direction: column;
              align-items: center;
              border: 1px solid #ccc;
              padding: 20px;
              border-radius: 10px;
            }
            .variety-name {
              font-size: 18px;
              font-weight: bold;
              margin-bottom: 10px;
            }
            .plant-info {
              font-size: 14px;
              margin-bottom: 15px;
              text-align: center;
            }
            .qrcode {
              margin-bottom: 15px;
            }
            @media print {
              .qr-container {
                border: 1px solid #ccc;
              }
            }
          </style>
        </head>
        <body>
          <div class="qr-container">
            <div class="variety-name">${plant.variety.name}</div>
            <div class="plant-info">
              ${t('qrcode.space')} ${plant.position.space} | ${t('qrcode.position')} L${plant.position.row} - C${plant.position.column}
            </div>
            <div class="qrcode">${printContent}</div>
            <div>${t('qrcode.scan')}</div>
          </div>
          <script>
            window.onload = function() {
              window.print();
              window.onfocus = function() { window.close(); }
            }
          </script>
        </body>
      </html>
    `);
    
    printWindow.document.close();
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex justify-between items-center">
          {t('qrcode.title')}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handlePrint}
            className="flex items-center gap-1"
          >
            <Printer className="h-4 w-4" /> 
            {t('qrcode.print')}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className="mb-3">
          {t('qrcode.scan')}
        </div>
        <div ref={qrCodeRef} className="border p-4 rounded-lg bg-white">
          <QRCodeSVG 
            value={qrCodeUrl}
            size={180}
            bgColor={"#ffffff"}
            fgColor={"#000000"}
            level={"H"}
            includeMargin={true}
          />
        </div>
        <div className="text-sm text-muted-foreground mt-3 text-center">
          {plant.variety.name} - {t('qrcode.space')} {plant.position.space} | L{plant.position.row} - C{plant.position.column}
        </div>
      </CardContent>
    </Card>
  );
};

export default PlantQRCode;
