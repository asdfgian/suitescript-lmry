/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/file'],

    function (file) {
        /**
         * Function to be executed after page is initialized.
         *
         * @param {Object} context
         * @param {Record} context.currentRecord - Current form record
         * @param {string} context.mode - The mode in which the record is being accessed (create, copy, or edit)
         *
         * @since 2015.2
         */
        function pageInit(scriptContext) {

        }

        function generate(id) {
            try {
                const reportFile = file.load({
                    id: 'SuiteScripts/Giancarlo Arias/Report/Reporte_Inventario_2025-11-25.pdf'
                });
                window.open(reportFile.url);
            } catch (e) {
                alert('Error al abrir el reporte: ' + e);
            }
        }

        return {
            pageInit,
            generate
        };

    });
