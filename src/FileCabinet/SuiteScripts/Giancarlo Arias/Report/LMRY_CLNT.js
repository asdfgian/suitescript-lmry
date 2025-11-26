/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/file'],

    function (file) {
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
