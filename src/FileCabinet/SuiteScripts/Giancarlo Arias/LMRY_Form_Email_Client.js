/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define([], () => {
    const pageInit = (scriptContext) => { };

    const fieldChanged = (scriptContext) => {
        const { currentRecord, fieldId } = scriptContext;
        if (fieldId === "custpage_department") {
            const departmentId = currentRecord.getValue({
                fieldId: "custpage_department",
            });
            const suiteletUrl = currentRecord.getValue({
                fieldId: "custpage_suitelet_url",
            });

            fetch(suiteletUrl, {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams({
                    action: "filterEmployees",
                    department: departmentId || "",
                }),
            })
                .then((res) => res.json())
                .then((data) => {
                    const employeeField = currentRecord.getField({
                        fieldId: "custpage_select_employee",
                    });

                    if (!employeeField) return;

                    employeeField.removeSelectOption({
                        value: null,
                    });
                    const lineCount = currentRecord.getLineCount({
                        sublistId: "custpage_sublist",
                    });
                    for (let i = lineCount - 1; i >= 0; i--) {
                        currentRecord.removeLine({
                            sublistId: "custpage_sublist",
                            line: i,
                            ignoreRecalc: true,
                        });
                    }

                    data.forEach((emp, i) => {
                        employeeField.insertSelectOption({
                            value: emp.id,
                            text: emp.name,
                        });

                        if (new String(emp.email).includes("@")) {
                            currentRecord.selectNewLine({ sublistId: "custpage_sublist" });

                            currentRecord.setCurrentSublistValue({
                                sublistId: "custpage_sublist",
                                fieldId: "custpage_col_email",
                                value: new String(emp.email),
                                ignoreFieldChange: true,
                                forceSyncSourcing: true,
                            });
                            currentRecord.commitLine({ sublistId: "custpage_sublist" });
                        }
                    });
                })
                .catch((err) => console.log("Error al cargar empleados:", err));
        }
    };

    function postSourcing(scriptContext) { }

    function sublistChanged(scriptContext) { }

    function lineInit(scriptContext) { }

    function validateField(scriptContext) { }

    function validateLine(scriptContext) { }

    function validateInsert(scriptContext) { }

    function validateDelete(scriptContext) { }

    function saveRecord(scriptContext) { }

    return {
        //pageInit,
        fieldChanged,
        //postSourcing: postSourcing,
        //sublistChanged: sublistChanged,
        //lineInit: lineInit,
        //validateField: validateField,
        //validateLine: validateLine,
        //validateInsert: validateInsert,
        //validateDelete: validateDelete,
        //saveRecord: saveRecord
    };
});
