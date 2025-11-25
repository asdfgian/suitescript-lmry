/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/ui/serverWidget', 'N/record'],

    (serverWidget, record) => {
        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} context
         * @param {ServerRequest} context.request - Incoming request
         * @param {ServerResponse} context.response - Suitelet response
         * @since 2015.2
         */
        const onRequest = (context) => {
            // const rec = record.load({
            //     type: 'customrecord_lmry_vehicle_gav',
            //     id: 1
            // });

            const form = serverWidget.createForm({
                title: 'Suitelet'
            });

            form.addField({
                id: 'custpage_hello_world',
                type: serverWidget.FieldType.INLINEHTML,
                label: 'hola'
            }).defaultValue = '<h1>...</h1>';

            form.addButton({
                id: 'custpage_my_button',
                label: 'View Report',
                functionName: 'generate("' + 1125722 + '")'
            });

            form.clientScriptModulePath = 'SuiteScripts/Giancarlo Arias/Report/LMRY_CLNT.js';

            context.response.writePage(form);
        }

        return { onRequest }

    });
