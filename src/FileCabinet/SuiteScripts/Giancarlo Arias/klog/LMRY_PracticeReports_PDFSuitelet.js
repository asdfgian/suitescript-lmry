/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 * @fileOverview Suitelet para generar reporte PDF usando FreeMarker
 * @description Suitelet que:
 *              1. Obtiene datos ficticios del DataProvider
 *              2. Prepara estructura de datos para FreeMarker
 *              3. Usa renderer para generar PDF desde plantilla FTL
 *              4. Descarga PDF al usuario
 */

define([
    "N/render",
    "N/file",
    "./LMRY_PracticeReports_DataProvider",
    "./LMRY_PracticeReports_Utils",
], (render, file, dataProvider, utils) => {
    /**
     * Prepara los datos para la plantilla PDF
     * Estructura los datos del DataProvider en formato listo para FreeMarker
     *
     * @returns {Object} Objeto con propiedades para usar en FTL
     */
    function prepareDataForPDF() {
        // @ts-ignore
        const metadata = dataProvider.getReportMetadata();
        // @ts-ignore
        const customerSummary = dataProvider.getDetailedCustomerSummary();
        // @ts-ignore
        const grandTotal = dataProvider.getGrandTotal();
        
        return {
            report: {
                title: metadata.reportTitle,
                description: metadata.reportDescription,
                generatedAt: metadata.generatedAt,
                generatedDate: metadata.generatedAt,
            },

            customerData: customerSummary,

            summary: {
                totalCustomers: metadata.totalCustomers,
                totalTransactions: metadata.totalTransactions,
                grandTotal: grandTotal,
                // @ts-ignore
                grandTotalFormatted: utils.formatCurrency(grandTotal),
            },
        };
    }

    /**
        * Defines the Suitelet script trigger point.
        * @param {Object} scriptContext
        * @param {import("N/http").ServerRequest} scriptContext.request - Incoming request
        * @param {import("N/http").ServerResponse} scriptContext.response - Suitelet response
        * @since 2015.2
        */
    function doGet(scriptContext) {
        try {
            var data = prepareDataForPDF();

            var templateFile = file.load({
                id: "./FreeMarker-Templates/practice-reports-pdf.ftl",
            });

            var templateContent = templateFile.getContents();

            const renderer = render.create();

            renderer.templateContent = templateContent;

            // @ts-ignore
            utils.logInfo("json", JSON.stringify(data))

            renderer.addCustomDataSource({
                format: render.DataSource.JSON,
                alias: 'jsonData',
                data: JSON.stringify(data)
            });

            const pdf = renderer.renderAsPdf();

            scriptContext.response.addHeader({
                name: "Content-Disposition",
                value:
                    'attachment; filename="Reporte_Clientes_' +
                    new Date().getTime() +
                    '.pdf"',
            });

            scriptContext.response.writeFile({file: pdf, isInline: true});

            // @ts-ignore
            utils.logInfo("PDF Report", "Reporte PDF generado exitosamente");

        } catch (e) {
            // @ts-ignore
            utils.logError("Error en doGet PDF", e);
            if (e instanceof Error) {
                scriptContext.response.write("Error al generar reporte PDF: " + e.message);
            }
        }
    }

    function doPost(context) {
        try {
            doGet(context);
        } catch (e) {
            // @ts-ignore
            utils.logError("Error en doPost PDF", e);
            if (e instanceof Error) {
                context.response.write("Error: " + e.message);
            }
        }
    }

    return {
        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {import("N/http").ServerRequest} scriptContext.request - Incoming request
         * @param {import("N/http").ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */
        onRequest: function (scriptContext) {
            if (scriptContext.request.method === "GET") {
                doGet(scriptContext);
            } else if (scriptContext.request.method === "POST") {
                doPost(scriptContext);
            }
        },
    };
});
