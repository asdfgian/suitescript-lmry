/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(["N/log", "N/ui/serverWidget"], (log, serverWidget) => {
    class SuiteletApp {
        constructor() {
            this.params = {
                formTitle: "Suitelet App",
                submitButtonLabel: "Submit",
                fieldGroup: {
                    id: "custpage_form",
                    label: "Formulario",
                    children: {
                        customer: {
                            id: "custpage_customer",
                            label: "Customer",
                            helpText: "Enter an internal ID.",
                            type: serverWidget.FieldType.TEXT,
                        },
                        employee: {
                            id: "custpage_employee",
                            label: "Employee",
                            type: serverWidget.FieldType.SELECT,
                            source: "employee",
                        }
                    }
                },
                sublist: {
                    id: "custpage_item_list",
                    label: "Item List",
                    type: serverWidget.SublistType.INLINEEDITOR,
                    children: {
                        item: {
                            id: "custpage_col_item",
                            label: "Item",
                            type: serverWidget.FieldType.TEXT
                        },
                        quantity: {
                            id: "custpage_col_quantity",
                            label: "Quantity",
                            type: serverWidget.FieldType.INTEGER
                        }
                    }
                }
            };
        }

        /**
         * @param {string} path
         */
        setClientScriptModulePath(path) {
            this.clientScriptModulePath = path || null;
        }

        _handleGet() {
            const form = serverWidget.createForm({ title: this.params.formTitle });

            form.addFieldGroup({
                id: this.params.fieldGroup.id,
                label: this.params.fieldGroup.label,
            });
            const customerField = form.addField({
                id: this.params.fieldGroup.children.customer.id,
                type: this.params.fieldGroup.children.customer.type,
                label: this.params.fieldGroup.children.customer.label,
            });
            customerField.isMandatory = true;
            customerField.setHelpText({ help: this.params.fieldGroup.children.customer.helpText });

            const employeeField = form.addField({
                id: this.params.fieldGroup.children.employee.id,
                type: this.params.fieldGroup.children.employee.type,
                label: this.params.fieldGroup.children.employee.label,
                source: this.params.fieldGroup.children.employee.source,
                container: this.params.fieldGroup.id,
            });
            employeeField.isMandatory = true;

            const sublist = form.addSublist({
                id: this.params.sublist.id,
                type: this.params.sublist.type,
                label: this.params.sublist.label,
            });

            Object.values(this.params.sublist.children).forEach(field => {
                sublist.addField({
                    id: field.id,
                    type: field.type,
                    label: field.label,
                });
            });

            form.addSubmitButton({ label: this.params.submitButtonLabel });

            if (this.clientScriptModulePath) {
                form.clientScriptModulePath = this.clientScriptModulePath;
            }
            //@ts-ignore
            this.scriptContext.response.writePage(form);
        }

        _handlePost() {
            try {
                //@ts-ignore
                const request = this.scriptContext.request;
                //@ts-ignore
                const lineCount = request.getLineCount({ group: this.params.sublist.id });

                //@ts-ignore.
                this.scriptContext.response.writeLine(`Customer: ${request.parameters[this.params.fieldGroup.children.customer.id]}`);
                //@ts-ignore.
                this.scriptContext.response.writeLine(`Sublist line count: ${lineCount}`);
            } catch (e) {
                log.error({ title: "Error Processing POST", details: e });
                throw new Error(
                    "An error occurred while processing the request. Check the logs"
                );
            }
        }

        /**
         * The main request handler for the Suitelet. It delegates to handleGet or handlePost
         * based on the HTTP request method.
         * @param {Object} scriptContext
         * @param {import("N/http").ServerRequest} scriptContext.request - Incoming request
         * @param {import("N/http").ServerResponse} scriptContext.response - Suitelet response
         */
        onRequest(scriptContext) {
            this.scriptContext = scriptContext;
            try {
                if (scriptContext.request.method === "GET") {
                    this._handleGet();
                } else {
                    this._handlePost();
                }
            } catch (e) {
                log.error({ title: "onRequest Error", details: e });
                throw new Error(
                    "An error occurred while processing the request. Check the logs");
            }
        }
    }

    /**
     * The main request handler for the Suitelet. It delegates to handleGet or handlePost
     * based on the HTTP request method.
     * @param {Object} scriptContext
     * @param {import("N/http").ServerRequest} scriptContext.request - Incoming request
     * @param {import("N/http").ServerResponse} scriptContext.response - Suitelet response
     */
    const onRequest = (scriptContext) => {
        const suiteletApp = new SuiteletApp();
        suiteletApp.onRequest(scriptContext);
    };

    return { onRequest };
});
