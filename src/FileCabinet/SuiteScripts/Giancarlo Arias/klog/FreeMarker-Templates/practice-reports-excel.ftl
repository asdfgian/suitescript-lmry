<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook 
    xmlns="urn:schemas-microsoft-com:office:spreadsheet"
    xmlns:o="urn:schemas-microsoft-com:office:office"
    xmlns:x="urn:schemas-microsoft-com:office:excel"
    xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
    xmlns:html="http://www.w3.org/TR/REC-html40">

    <Worksheet ss:Name="Resumen">
        <Table>
            <Row ss:Height="30">
                <Cell ss:StyleID="sectionTitleStyle" ss:MergedAcross="4">
                    <Data ss:Type="String">${data.title}</Data>
                </Cell>
            </Row>
            <Row ss:Height="30">
                <Cell ss:StyleID="sectionTitleStyle" ss:MergedAcross="4">
                    <Data ss:Type="String">Data rows size: ${data.rows?size}</Data>
                </Cell>
            </Row>

            <Row ss:Height="15">
                <Cell>
                    <Data ss:Type="String"></Data>
                </Cell>
            </Row>

            <Row>
                <#list data.columns as column>
                    <Cell>
                        <Data ss:Type="String">${column?xml}</Data>
                    </Cell>
                </#list>
            </Row>

            <#list data.rows as row>
                <Row>
                    <#list row.cols as column>
                        <Cell>
                            <Data ss:Type="String">${column?xml}</Data>
                        </Cell>
                    </#list>
                </Row>
            </#list>

        </Table>
    </Worksheet>
</Workbook>