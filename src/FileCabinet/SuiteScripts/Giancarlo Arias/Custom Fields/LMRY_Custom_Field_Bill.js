/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N/record', 'N/log', 'N/format'],

    (record, log, format) => {

        const beforeLoad = (scriptContext) => {

        }


        const beforeSubmit = (context) => {
            if (context.type === context.UserEventType.CREATE ||
                context.type === context.UserEventType.EDIT) {

                const rec = context.newRecord;

                const entryDate = rec.getValue({ fieldId: 'custbody_new_entry_date' });
                const termId = rec.getValue({ fieldId: 'terms' });

                if (entryDate && termId) {
                    try {
                        const termRecord = record.load({
                            type: record.Type.TERM,
                            id: termId
                        });

                        const daysUntilNetDue = termRecord.getValue({ fieldId: 'daysuntilnetdue' });

                        if (daysUntilNetDue) {
                            const formatted = format.parse({
                                value: entryDate,
                                type: format.Type.DATE
                            });

                            if (formatted instanceof Date) {
                                formatted.setDate(formatted.getDate() + Number(daysUntilNetDue));
                            }
                            rec.setValue({
                                fieldId: 'duedate',
                                value: formatted
                            });

                        }
                    } catch (e) {
                        if (e instanceof Error) {
                            log.error({
                                title: 'Error',
                                details: e.toString()
                            });
                        }
                    }
                }
            }
        }

        const afterSubmit = (scriptContext) => {

        }

        return { beforeLoad, beforeSubmit, afterSubmit }

    });
