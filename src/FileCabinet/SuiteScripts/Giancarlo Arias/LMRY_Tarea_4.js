/**
 * @NApiVersion 2.1
 * @NScriptType Restlet
 */
define(["N/log", "N/record"],
    (log, record) => {
        const get = (req) => {
            try {
                // const so = record.create({
                //     type: record.Type.SALES_ORDER,
                //     isDynamic: true
                // });

                // so.setValue({ fieldId: 'entity', value: 78239 });
                // so.setValue({ fieldId: 'subsidiary', value: 6 });
                // so.setValue({ fieldId: 'location', value: 11 });

                // so.selectNewLine({ sublistId: 'item' });

                // so.setCurrentSublistValue({
                //     sublistId: 'item',
                //     fieldId: 'item',
                //     value: 5100
                // });

                // so.setCurrentSublistValue({
                //     sublistId: 'item',
                //     fieldId: 'quantity',
                //     value: 1
                // });

                // so.setCurrentSublistValue({
                //     sublistId: 'item',
                //     fieldId: 'amount',
                //     value: 4343.3
                // });

                // so.commitLine({ sublistId: 'item' });

                // const soId = so.save();

                // log.debug({ title: "Sales Order ID:", details: soId })

                // const fulfillment = record.transform({
                //     fromType: record.Type.SALES_ORDER,
                //     fromId: soId,
                //     toType: record.Type.ITEM_FULFILLMENT,
                //     isDynamic: true
                // })
                // fulfillment.setValue({ fieldId: 'shipstatus', value: 'C' });
                // const fulfillmentId = fulfillment.save()

                // log.debug({ title: "Fulfillment ID:", details: fulfillmentId })

                // const invoice = record.transform({
                //     fromType: record.Type.SALES_ORDER,
                //     fromId: soId,
                //     toType: record.Type.ITEM_FULFILLMENT,
                //     isDynamic: true
                // });

                // const invoiceId = invoice.save();
                // log.debug("Invoice creada id: ", invoiceId);

                // const inv = record.load({
                //     type: record.Type.ITEM_FULFILLMENT,
                //     id: 2109460
                // });


                const invoiceRecord = record.transform({
                    fromType: record.Type.SALES_ORDER,
                    fromId: 2109358,
                    toType: record.Type.INVOICE,
                    isDynamic: false
                });

                const invoiceId = invoiceRecord.save();
                log.debug("Invoice creada id: ", invoiceId);

                const inv = record.load({
                    type: record.Type.INVOICE,
                    id: invoiceId
                });

                const itemCount = inv.getLineCount({ sublistId: 'item' });

                const itemsJson = [];
                for (let i = 0; i < itemCount; i++) {
                    itemsJson.push({
                        item: inv.getSublistValue({ sublistId: 'item', fieldId: 'item', line: i }),
                        quantity: inv.getSublistValue({ sublistId: 'item', fieldId: 'quantity', line: i }),
                        rate: inv.getSublistValue({ sublistId: 'item', fieldId: 'rate', line: i }),
                        amount: inv.getSublistValue({ sublistId: 'item', fieldId: 'amount', line: i })
                    });
                }

                log.debug("Response", JSON.stringify(itemsJson));

                return {
                    success: true
                };

            } catch (error) {
                if (error instanceof Error) {
                    return {
                        success: false,
                        error: error.message,
                    };
                }

                return {
                    success: false,
                    error: String(error),
                };
            }
        }

        const post = (requestBody) => {
            const { entity_id, items } = requestBody;
            try {
                const so = record.create({
                    type: record.Type.SALES_ORDER,
                    isDynamic: true
                });

                so.setValue({
                    fieldId: 'entity',
                    value: 78239
                });
                so.setValue({ fieldId: 'subsidiary', value: 6 });
                so.setValue({ fieldId: 'orderstatus', value: "B" });
                so.setValue({ fieldId: 'location', value: 11 });

                so.selectNewLine({ sublistId: 'item' });

                so.setCurrentSublistValue({
                    sublistId: 'item',
                    fieldId: 'item',
                    value: 5100
                });

                so.setCurrentSublistValue({
                    sublistId: 'item',
                    fieldId: 'quantity',
                    value: 1
                });

                so.setCurrentSublistValue({
                    sublistId: 'item',
                    fieldId: 'amount',
                    value: 4343.3
                });

                so.commitLine({ sublistId: 'item' });

                const soId = so.save();

                log.debug({ title: "Sales Order ID:", details: soId })

                const invoice = record.transform({
                    fromType: record.Type.SALES_ORDER,
                    fromId: soId,
                    toType: record.Type.INVOICE,
                    isDynamic: true
                });

                const invoiceId = invoice.save();
                log.debug("Invoice creada", invoiceId);

                const inv = record.load({
                    type: record.Type.INVOICE,
                    id: invoiceId
                });

                const itemCount = inv.getLineCount({ sublistId: 'item' });

                const itemsJson = [];
                for (let i = 0; i < itemCount; i++) {
                    itemsJson.push({
                        item: inv.getSublistValue({ sublistId: 'item', fieldId: 'item', line: i }),
                        quantity: inv.getSublistValue({ sublistId: 'item', fieldId: 'quantity', line: i }),
                        rate: inv.getSublistValue({ sublistId: 'item', fieldId: 'rate', line: i }),
                        amount: inv.getSublistValue({ sublistId: 'item', fieldId: 'amount', line: i })
                    });
                }

                log.debug("Response", JSON.stringify(itemsJson));

                return {
                    success: true,
                    message: "Sales Order creada correctamente",
                    salesOrderId: soId
                };

            } catch (error) {
                if (error instanceof Error) {
                    return {
                        success: false,
                        error: error.message,
                    };
                }

                return {
                    success: false,
                    error: String(error),
                };
            }
        };

        return { get, post };
    });
