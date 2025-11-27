/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 * @fileOverview Formulario de prueba para reportes de práctica
 * @description Forma que proporciona:
 *              - Información sobre el proyecto
 *              - Botón para generar PDF
 *              - Botón para generar Excel
 *              - Instrucciones de uso
 */

define([
    'N/ui/serverWidget',
    'N/url'
], (serverWidget, url) => {

    /**
    * Defines the Suitelet script trigger point.
    * @param {Object} scriptContext
    * @param {import("N/http").ServerRequest} scriptContext.request - Incoming request
    * @param {import("N/http").ServerResponse} scriptContext.response - Suitelet response
    * @since 2015.2
    */
    function doGet(scriptContext) {
        try {
            const form = serverWidget.createForm({
                title: 'Reportes FreeMarker',
                hideNavBar: false
            });

            form.addField({
                id: 'custpage_style',
                type: serverWidget.FieldType.INLINEHTML,
                label: ' '
            }).defaultValue = '<style>' +
            '.form-section { margin: 20px 0; padding: 15px; background-color: #f5f5f5; border-radius: 5px; }' +
            '.form-section h3 { color: #2c3e50; margin-bottom: 10px; }' +
            '.form-section p { color: #555; line-height: 1.6; margin: 8px 0; }' +
            '.code-block { background-color: #ecf0f1; padding: 10px; border-left: 3px solid #3498db; margin: 10px 0; font-family: monospace; font-size: 12px; }' +
            '.button-container { margin: 20px 0; }' +
            '.button-group { display: inline-block; margin-right: 20px; }' +
            '.instruction-box { background-color: #d4edda; border: 1px solid #c3e6cb; padding: 15px; border-radius: 4px; margin: 15px 0; }' +
            '.instruction-box strong { color: #155724; }' +
                '</style>';

            form.addField({
                id: 'custpage_instructions',
                type: serverWidget.FieldType.INLINEHTML,
                label: ' '
            }).defaultValue = '<div class="instruction-box">' +
            '<strong>⚙️ Instrucciones de Uso:</strong><br>' +
            '<ol>' +
            '<li>Haz clic en <strong>"Generar PDF"</strong> para descargar un PDF con clientes y transacciones</li>' +
            '<li>Haz clic en <strong>"Generar Excel"</strong> para descargar un Excel con múltiples hojas</li>' +
            '<li>Ambos reportes usan datos ficticios del módulo DataProvider</li>' +
            '<li>Abre las plantillas FTL para ver cómo se estructura el contenido con FreeMarker</li>' +
            '<li>Modifica los datos ficticios para practicar cambios en reportes</li>' +
            '</ol>' +
                '</div>';

            form.addField({
                id: 'custpage_actions',
                type: serverWidget.FieldType.INLINEHTML,
                label: ' '
            }).defaultValue = '<div class="form-section">' +
            '<h3>📥 Generar Reportes</h3>' +
            '<p>Selecciona el tipo de reporte que deseas descargar:</p>' +
            '<div class="button-container">' +
            '<form method="GET" action="/app/site/hosting/scriptlet.nl?script=6046&deploy=1" style="display:inline;">' +
            '<button type="submit" style="padding: 10px 20px; font-size: 14px; background-color: #e74c3c; color: white; border: none; border-radius: 4px; cursor: pointer;">' +
            '📄 Generar PDF' +
            '</button>' +
            '</form>' +
            '&nbsp;&nbsp;' +
            '<form method="GET" action="/app/site/hosting/scriptlet.nl?script=6045&deploy=1" style="display:inline;">' +
            '<button type="submit" style="padding: 10px 20px; font-size: 14px; background-color: #27ae60; color: white; border: none; border-radius: 4px; cursor: pointer;">' +
            '📊 Generar Excel' +
            '</button>' +
            '</form>' +
            '</div>' +
                '</div>';

            scriptContext.response.writePage(form);

        } catch (e) {
            if (e instanceof Error) {
                scriptContext.response.write('Error al cargar el formulario: ' + e.message);
            }
        }
    }

    function doPost(context) {
        doGet(context);
    }

    return {
        onRequest: function (context) {
            if (context.request.method === 'GET') {
                doGet(context);
            } else if (context.request.method === 'POST') {
                doPost(context);
            }
        }
    };
});
