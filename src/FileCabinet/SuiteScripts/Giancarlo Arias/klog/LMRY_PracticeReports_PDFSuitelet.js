/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */

define([
    "./LMRY_PracticeReports_DataProvider",
    "./FreeMarkerProcessor",
    "./LMRY_PracticeReports_Utils",
], (dataProvider, freeMarkerProcessor, utils) => {
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
            const data = prepareDataForPDF();

            //@ts-ignore
            freeMarkerProcessor.setTemplateId(
                "./FreeMarker-Templates/practice-reports-pdf.ftl"
            );
            //@ts-ignore
            freeMarkerProcessor.setDataType("json");
            //@ts-ignore
            freeMarkerProcessor.setAlias("jsonData");
            //@ts-ignore
            freeMarkerProcessor.setData(data);
            //@ts-ignore
            const pdf = freeMarkerProcessor.renderToPDF("ReportePDF");

            scriptContext.response.writeFile(pdf);
        } catch (e) {
            if (e instanceof Error) {
                scriptContext.response.write(
                    "Error al generar reporte PDF: " + e.message
                );
            }
        }
    }

    function doPost(context) {
        try {
            doGet(context);
        } catch (e) {
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
