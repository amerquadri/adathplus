:: Batch script to upload via FTP (Windows)
@echo off
echo Connecting to FTP server...
echo Make sure to replace the following with your actual details:
echo - ftp.yourhost.com (your FTP server)
echo - yourusername (your FTP username)  
echo - yourpassword (your FTP password)
echo.
echo Manual FTP Steps:
echo 1. Connect to: ftp.yourhost.com
echo 2. Login with your credentials
echo 3. Navigate to: public_html or www folder
echo 4. Upload all files from: h:\Ocean\Temp\Angular\adathplus\dist\adathplus\browser\
echo 5. Make sure .htaccess file is uploaded
echo.
pause

:: Example FTP commands (edit with your details):
:: ftp -s:deploy.txt ftp.yourhost.com

:: Create deploy.txt file with:
:: yourusername
:: yourpassword  
:: cd public_html
:: binary
:: prompt off
:: mput *.*
:: quit