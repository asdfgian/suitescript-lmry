/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(
    ["N/record", "N/ui/serverWidget", "N/log", "N/search"],
    /**
     * @param{record} record
     * @param{serverWidget} serverWidget
     */
    (record, serverWidget, log, search) => {
        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */
        const onRequest = (scriptContext) => {
            const { request, response } = scriptContext;

            log.debug({
                title: "Method",
                details: request.method,
            });

            if (request.method === "GET") {
                const form = serverWidget.createForm({
                    title: "Vehicles GAV",
                    hideNavBar: false,
                });

                form.addFieldGroup({
                    id: "custpage_vehicle_form",
                    label: "Formulario",
                });

                const vim = form.addField({
                    id: "custpage_txt_vim",
                    type: serverWidget.FieldType.TEXT,
                    label: "VIM",
                    container: "custpage_vehicle_form",
                });
                vim.isMandatory = true

                form.addField({
                    id: "custpage_txt_brand",
                    type: serverWidget.FieldType.TEXT,
                    label: "Brand",
                    container: "custpage_vehicle_form",
                });

                form.addField({
                    id: "custpage_txt_model",
                    type: serverWidget.FieldType.TEXT,
                    label: "Model",
                    container: "custpage_vehicle_form",
                });

                form.addField({
                    id: "custpage_int_year",
                    type: serverWidget.FieldType.INTEGER,
                    label: "Year",
                    container: "custpage_vehicle_form",
                });

                form.addField({
                    id: "custpage_txt_color",
                    type: serverWidget.FieldType.TEXT,
                    label: "Color",
                    container: "custpage_vehicle_form",
                });

                form.addField({
                    id: "custpage_float_price",
                    type: serverWidget.FieldType.FLOAT,
                    label: "Price",
                    container: "custpage_vehicle_form",
                });

                form.addField({
                    id: "custpage_select_owner",
                    type: serverWidget.FieldType.SELECT,
                    label: "Owner",
                    source: "employee",
                    container: "custpage_vehicle_form",
                });

                form.addSubmitButton({ label: "Submit" });
                form.addResetButton({ label: "Reset" });

                response.writePage({ pageObject: form });
            } else {
                const vin = request.parameters.custpage_txt_vim;
                const band = request.parameters.custpage_txt_brand;
                const model = request.parameters.custpage_txt_model;
                const year = request.parameters.custpage_int_year;
                const color = request.parameters.custpage_txt_color;
                const price = request.parameters.custpage_float_price;
                const owner = request.parameters.custpage_select_owner;

                log.debug({
                    title: "Parameters",
                    details: request.parameters
                })

                const vehicleRecord = record.create({
                    type: 'customrecord_lmry_vehicle_gav',
                    isDynamic: true
                });

                vehicleRecord.setValue({
                    fieldId: 'custrecord_lmry_vehicle_vin',
                    value: vin
                });
                vehicleRecord.setValue({
                    fieldId: 'custrecord_lmry_vehicle_brand',
                    value: band
                });
                vehicleRecord.setValue({
                    fieldId: 'custrecord_lmry_vehicle_model',
                    value: model
                });
                vehicleRecord.setValue({
                    fieldId: 'custrecord_lmry_vehicle_year',
                    value: parseInt(year)
                });
                vehicleRecord.setValue({
                    fieldId: 'custrecord_lmry_vehicle_color',
                    value: color
                });
                vehicleRecord.setValue({
                    fieldId: 'custrecord_lmry_vehicle_price',
                    value: parseFloat(price)
                });
                vehicleRecord.setValue({
                    fieldId: 'custrecord_lmry_vehicle_owner',
                    value: owner
                });

                vehicleRecord.save();

                const form = serverWidget.createForm({ title: "Vehicle List" });

                const sublist = form.addSublist({
                    id: 'custpage_vehicle_list',
                    type: serverWidget.SublistType.LIST,
                    label: 'Registered Vehicles'
                });

                sublist.addField({ id: 'custpage_col_vin', label: 'VIN', type: serverWidget.FieldType.TEXT });
                sublist.addField({ id: 'custpage_col_brand', label: 'Brand', type: serverWidget.FieldType.TEXT });
                sublist.addField({ id: 'custpage_col_model', label: 'Model', type: serverWidget.FieldType.TEXT });
                sublist.addField({ id: 'custpage_col_year', label: 'Year', type: serverWidget.FieldType.INTEGER });
                sublist.addField({ id: 'custpage_col_color', label: 'Color', type: serverWidget.FieldType.TEXT });
                sublist.addField({ id: 'custpage_col_price', label: 'Price', type: serverWidget.FieldType.CURRENCY });
                sublist.addField({ id: 'custpage_col_owner', label: 'Owner', type: serverWidget.FieldType.TEXT });

                const vehicleSearch = search.create({
                    type: 'customrecord_lmry_vehicle_gav',
                    columns: [
                        'custrecord_lmry_vehicle_vin',
                        'custrecord_lmry_vehicle_brand',
                        'custrecord_lmry_vehicle_model',
                        'custrecord_lmry_vehicle_year',
                        'custrecord_lmry_vehicle_color',
                        'custrecord_lmry_vehicle_price',
                        'custrecord_lmry_vehicle_owner'
                    ]
                });

                const results = vehicleSearch.run().getRange({ start: 0, end: 20 });

                results.forEach((result, index) => {
                    sublist.setSublistValue({
                        id: 'custpage_col_vin',
                        line: index,
                        value: result.getValue('custrecord_lmry_vehicle_vin') || ''
                    });
                    sublist.setSublistValue({
                        id: 'custpage_col_brand',
                        line: index,
                        value: result.getValue('custrecord_lmry_vehicle_brand') || ''
                    });
                    sublist.setSublistValue({
                        id: 'custpage_col_model',
                        line: index,
                        value: result.getValue('custrecord_lmry_vehicle_model') || ''
                    });
                    sublist.setSublistValue({
                        id: 'custpage_col_year',
                        line: index,
                        value: result.getValue('custrecord_lmry_vehicle_year') || ''
                    });
                    sublist.setSublistValue({
                        id: 'custpage_col_color',
                        line: index,
                        value: result.getValue('custrecord_lmry_vehicle_color') || ''
                    });
                    sublist.setSublistValue({
                        id: 'custpage_col_price',
                        line: index,
                        value: result.getValue('custrecord_lmry_vehicle_price') || ''
                    });
                    sublist.setSublistValue({
                        id: 'custpage_col_owner',
                        line: index,
                        value: result.getText('custrecord_lmry_vehicle_owner') || ''
                    });
                });

                response.writePage({ pageObject: form });
            }
        };

        return { onRequest };
    });
