/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N/record', 'N/log', 'N/format'],
    /**
 * @param{record} record
 * @param{log} log
 */
    (record, log, format) => {
        /**
         * Defines the function definition that is executed before record is loaded.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @param {Form} scriptContext.form - Current form
         * @param {Se   rvletRequest} scriptContext.request - HTTP request information sent from the browser for a client action only.
         * @since 2015.2
         */
        const beforeLoad = (scriptContext) => {

        }

        /**
         * Defines the function definition that is executed before record is submitted.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @since 2015.2
         */
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

                            formatted.setDate(formatted.getDate() + daysUntilNetDue);

                            rec.setValue({
                                fieldId: 'duedate',
                                value: formatted
                            });

                        }
                    } catch (e) {
                        log.error({
                            title: 'Error',
                            details: e.toString()
                        });
                    }
                }
            }
        }

        /**
         * Defines the function definition that is executed after record is submitted.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @since 2015.2
         */
        const afterSubmit = (scriptContext) => {

        }

        return { beforeLoad, beforeSubmit, afterSubmit }

    });
