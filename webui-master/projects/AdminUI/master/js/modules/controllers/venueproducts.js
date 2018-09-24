/**
 * =======================================================
 * Module: venuemaps.js
 * smangipudi 
 * =========================================================
 */

App.controller('VenueProductsController', ['$scope', '$state', '$compile', '$timeout', 'RestServiceFactory',
    'DataTableService', 'toaster', '$stateParams', 'ngDialog', 'DialogService',
    function ($scope, $state, $compile, $timeout, RestServiceFactory, DataTableService, toaster,
        $stateParams, ngDialog, DialogService) {
        'use strict';


        $scope.initServiceTimeTable = function () {
            if (!$.fn.dataTable || $stateParams.id === 'new') {
                return;
            }
            var columnDefinitions = [
                { sWidth: "9%", aTargets: [0, 1, 2, 3, 5, 6, 7] },
                { sWidth: "20%", aTargets: [4] },
                { sWidth: "17%", aTargets: [8] },
                {
                    "targets": [8],
                    "orderable": false,
                    "createdCell": function (td, cellData, rowData, row, col) {

                        var actionHtml = '<button title="Edit" class="btn btn-default btn-oval fa fa-edit"></button>' +
                            '&nbsp;&nbsp;<button title="Delete" class="btn btn-default btn-oval fa fa-trash"></button>';

                        $(td).html(actionHtml);
                        $compile(td)($scope);
                    }
                }];

            DataTableService.initDataTable('products_table', columnDefinitions, false,
                "<'row'<'col-xs-6'l<'product_type_selector'>><'col-xs-6'f>r>t<'row'<'col-xs-6'i><'col-xs-6'p>>");

            $('.product_type_selector').html('<label>Show Products:</label> <select id="product_type" name="products_type" ' +
                'aria-controls="products_type" class="form-control input-sm">' +
                '<option value="ALL">ALL</option>' +
                '<option value="Food">Food</option>' +
                '<option value="Drinks">Drinks</option>' +
                '<option value="Bottle">Bottle</option></select>');

            var table = $('#products_table').DataTable();

            $('#products_table').on('click', '.fa-edit', function () {
                $scope.editProduct(this, table);
            });

            $('#products_table').on('click', '.fa-trash', function () {
                $scope.deleteProduct(this, table);
            });

            $('#product_type').on('change', function () {
                var val = jQuery(this).val();//$.fn.dataTable.util.escapeRegex();
                if (val === "ALL") {
                    val = "";
                }
                table.column(1).search(val ? '^' + val + '$' : '', true, false).draw();
            });

            var promise = RestServiceFactory.ProductService().get({ id: $stateParams.id, role: 'admin' });
            promise.$promise.then(function (data) {

                $scope.productMap = [];
                data.map(function (product) {
                    if (product.productType !== 'VenueMap') {
                        $scope.productMap[product.id] = product;
                        table.row.add([product.name, product.productType, product.category, product.brand, product.description,
                        product.price, product.size, product.servingSize, product]);
                    }
                });

                table.draw();
            });
        }

        $scope.editProduct = function (button, table) {
            var targetRow = $(button).closest("tr");
            var rowData = table.row(targetRow).data();
            $state.go('app.editProducts', { venueNumber: $stateParams.id, id: rowData[8].id });
        };

        $scope.createNewProducts = function () {
            $state.go('app.editProducts', { venueNumber: $stateParams.id, id: 'new' });
        };

        $scope.deleteProduct = function (button, table) {
            DialogService.confirmYesNo('Delete Products?', 'Are you sure want to delete selected products?', function () {
                var targetRow = $(button).closest("tr");
                var rowData = table.row(targetRow).data();
                var target = { id: $stateParams.id, productId: rowData[8].id };
                RestServiceFactory.ProductService().delete(target, function (data) {
                    table.row(targetRow).remove().draw();
                }, function (error) {
                    if (typeof error.data !== 'undefined') {
                        toaster.pop('error', "Server Error", error.data.developerMessage);
                    }
                });
            });
        };

        $timeout(function () {
            $scope.initServiceTimeTable();
        });

    }]);