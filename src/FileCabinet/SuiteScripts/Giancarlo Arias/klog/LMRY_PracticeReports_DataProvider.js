define([], function() {
    function getCustomers() {
        return [
            {
                id: 1,
                nombre: 'Juan Rodríguez',
                empresa: 'Tecnología Avanzada S.A.',
                email: 'juan.rodriguez@tech.com',
                ciudad: 'Madrid'
            },
            {
                id: 2,
                nombre: 'María García',
                empresa: 'Soluciones Digitales LLC',
                email: 'maria.garcia@solutions.com',
                ciudad: 'Barcelona'
            },
            {
                id: 3,
                nombre: 'Carlos López',
                empresa: 'Consultoría Global Inc.',
                email: 'carlos.lopez@consulting.com',
                ciudad: 'Valencia'
            },
            {
                id: 4,
                nombre: 'Ana Fernández',
                empresa: 'Innovación Empresarial Ltd.',
                email: 'ana.fernandez@innovation.com',
                ciudad: 'Bilbao'
            },
            {
                id: 5,
                nombre: 'Pedro Martínez',
                empresa: 'Transformación Digital Co.',
                email: 'pedro.martinez@transform.com',
                ciudad: 'Sevilla'
            }
        ];
    }

    function getTransactions() {
        return [
            {
                id: 'TXN-001',
                customerId: 1,
                fecha: '2025-11-01',
                descripcion: 'Licencias de software',
                monto: 1500.00,
                estado: 'Completada'
            },
            {
                id: 'TXN-002',
                customerId: 1,
                fecha: '2025-11-05',
                descripcion: 'Servicios de consultoría',
                monto: 3200.00,
                estado: 'Completada'
            },
            {
                id: 'TXN-003',
                customerId: 2,
                fecha: '2025-11-03',
                descripcion: 'Desarrollo de aplicación web',
                monto: 5000.00,
                estado: 'En proceso'
            },
            {
                id: 'TXN-004',
                customerId: 2,
                fecha: '2025-11-07',
                descripcion: 'Mantenimiento anual',
                monto: 800.00,
                estado: 'Completada'
            },
            {
                id: 'TXN-005',
                customerId: 3,
                fecha: '2025-11-02',
                descripcion: 'Capacitación de equipos',
                monto: 2100.00,
                estado: 'Completada'
            },
            {
                id: 'TXN-006',
                customerId: 4,
                fecha: '2025-11-06',
                descripcion: 'Integración de sistemas',
                monto: 4500.00,
                estado: 'En proceso'
            },
            {
                id: 'TXN-007',
                customerId: 5,
                fecha: '2025-11-04',
                descripcion: 'Hosting y soporte',
                monto: 350.00,
                estado: 'Completada'
            },
            {
                id: 'TXN-008',
                customerId: 3,
                fecha: '2025-11-08',
                descripcion: 'Auditoría de seguridad',
                monto: 2800.00,
                estado: 'Completada'
            }
        ];
    }

    function getTransactionsByCustomer(customerId) {
        const transactions = getTransactions();
        return transactions.filter(function(txn) {
            return txn.customerId === customerId;
        });
    }

    function getCustomerTotal(customerId) {
        const transactions = getTransactionsByCustomer(customerId);
        let total = 0;
        
        for (let i = 0; i < transactions.length; i++) {
            total += transactions[i].monto;
        }
        
        return total;
    }

    function getDetailedCustomerSummary() {
        var customers = getCustomers();
        var summary = [];

        for (var i = 0; i < customers.length; i++) {
            const customer = customers[i];
            const transactions = getTransactionsByCustomer(customer.id);
            const total = getCustomerTotal(customer.id);

            summary.push({
                customer: customer,
                transactions: transactions,
                total: total,
                transactionCount: transactions.length
            });
        }

        return summary;
    }

    function getGrandTotal() {
        const transactions = getTransactions();
        let grand = 0;
        
        for (var i = 0; i < transactions.length; i++) {
            grand += transactions[i].monto;
        }
        
        return grand;
    }

    /**
     * Obtiene metadatos del reporte (fecha, cantidad de clientes, etc.)
     * @returns {Object} Metadata del reporte
     */
    function getReportMetadata() {
        const customers = getCustomers();
        const transactions = getTransactions();
        
        return {
            generatedAt: new Date().toISOString(),
            totalCustomers: customers.length,
            totalTransactions: transactions.length,
            reportTitle: 'Reporte de Clientes y Transacciones',
            reportDescription: 'Reporte de práctica para demostración de FreeMarker en NetSuite'
        };
    }

    return {
        getCustomers: getCustomers,
        getTransactions: getTransactions,
        getTransactionsByCustomer: getTransactionsByCustomer,
        getCustomerTotal: getCustomerTotal,
        getDetailedCustomerSummary: getDetailedCustomerSummary,
        getGrandTotal: getGrandTotal,
        getReportMetadata: getReportMetadata
    };
});
