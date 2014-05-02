var cbArray = [];

function arrayPop(item, ary) {
    var array = ary;
    var i = array.indexOf(item);
    if(i != -1) {
        array.splice(i, 1);
    }
    return array;
}

function today() {
    var lenCheck = function (num) {
        return (num.toString().length > 1) ? num : '0' + num;
    };
    var d = new Date();
    
    return lenCheck(d.getMonth()+1) + "/" + lenCheck(d.getDate()) + "/" + d.getFullYear();
}





$(document).ready(function() {
    /**
     * Event handlers
     */
    $('#filterButton').click(function(e) {
        e.preventDefault();
        var oTable = $('#jobPostings').dataTable();
        if (cbArray.length > 0) {
            var a = cbArray.join();
            oTable.fnFilter(
                cbArray.join('|'),
                null,
                true,
                false
            );

        } else {
            jobPostings.clearFilter();
        }
    });

    $('#date-range').change( function() {
        $('#jobPostings').dataTable().fnDraw();
    });

    $('#isFiltered').click(function() {
        jobPostings.clearFilter();
    });
    /**
     * End event handlers
     */
} );



/**
 * Job Posting
 */

var jobPostings = function(){
    // private variables *******
    var settings = {
        urls: {},
        emailFriend: false
    };

    var oTable, _,$;

    // private functions
    var privateFunc = function() {};

    var handshake = function() {
        $.getJSON( settings.urls.invokeNotificationServiceUrl);
    };

    var clearFilter = function() {
        oTable.fnFilterClear();
    };

    var displayJob = function(row) {
        var data = oTable.fnGetData( row );
        data.emailFriend = settings.emailFriend;

        populateTemplate(data);

    };

    var toggleFavorite = function(el) {
        var star = $(el).children('i');

        var jqxhr = $.get( el.href, function() {
          star.toggleClass('fa-star-o fa-star');
        })
        .fail(function() {
            //console.log( "error" );
        });

        var aPos = oTable.fnGetPosition( el.parentNode );
        var aData = oTable.fnGetData( aPos[0] );

        oTable.fnUpdate( !aData.favorite, aPos[0], aPos[1], false ); // Single cell
    };

    var populateTemplate = function(data) {
        var tmpl = _.template($("#jobDescriptionModal").html(), data);
        $('#jobDetailsModal').find('.modal-content').html(tmpl);

        toggleModal();
        /**
         * Modal Button Event handlers
         */
        $('#emailFriendButton').on('click', function(e) {
            $('#modal-overlay').show();
        });
        $('#cancelEmailButton').on('click', function(e) {
            $('#modal-overlay').hide();
        });
        $('#sendEmailButton').on('click', function(e) {
            $.post( "test.php", $('#emailFriendForm').serialize());
            $('#modal-overlay').hide();
            toggleModal();
        });
    };

    var toggleModal = function() {
        $('#jobDetailsModal').modal('toggle');
    };

    var removeLoadingOverlay = function() {
        /**
         * Since the table is rendered, hide the loading overlay
         */
        var node = document.getElementById("loading");
        if (node.parentNode) {
          node.parentNode.removeChild(node);
        }
    };

    var initTable = function() {
        $.fn.dataTableExt.oApi.fnGetHiddenNodes = function ( oSettings )
        {
            /* Note the use of a DataTables 'private' function thought the 'oApi' object */
            var anNodes = this.oApi._fnGetTrNodes( oSettings );
            var anDisplay = $('tbody tr', oSettings.nTable);
              
            /* Remove nodes which are being displayed */
            for ( var i=0 ; i<anDisplay.length ; i++ )
            {
                var iIndex = jQuery.inArray( anDisplay[i], anNodes );
                if ( iIndex != -1 )
                {
                    anNodes.splice( iIndex, 1 );
                }
            }
              
            /* Fire back the array to the caller */
            return anNodes;
        };

        /**
         * Date Filter
         */
        $.fn.dataTableExt.afnFiltering.push(
            function( oSettings, aData, iDataIndex ) {

                var min = document.getElementById('date-range').value;
                if (min === '' ) {
                    return true;
                }
                min = Date.parse(min);

                var iStartDateCol = 3;
                var iEndDateCol = 3;

                var colDate = Date.parse(aData[iStartDateCol]);

                if ( colDate >= min ) {
                    // console.log('show');
                    return true;
                }
                return false;
            }
        );
        // End date Filter

        $.extend( true, $.fn.dataTable.defaults, {
            "sDom": "<'row'<'col-md-6'><'col-md-6 text-right'l>r>t<'row'<'col-md-6'i><'col-md-6'p>>",
            "sPaginationType": "bootstrap",
            "oLanguage": {
                "sLengthMenu": "Show _MENU_ entries"
            }
        } );
        
        /* Default class modification */
        $.extend( $.fn.dataTableExt.oStdClasses, {
            "sWrapper": "dataTables_wrapper form-inline"
        } );

        $.fn.dataTableExt.oApi.fnFilterClear  = function ( oSettings )
        {
            /* Remove global filter */
            oSettings.oPreviousSearch.sSearch = "";
              
            /* Remove the text of the global filter in the input boxes */
            if ( typeof oSettings.aanFeatures.f != 'undefined' )
            {
                var n = oSettings.aanFeatures.f;
                for ( var i=0, iLen=n.length ; i<iLen ; i++ )
                {
                    $('input', n[i]).val( '' );
                }
            }
              
            /* Remove the search text for the column filters - NOTE - if you have input boxes for these
             * filters, these will need to be reset
             */
            for ( var i=0, iLen=oSettings.aoPreSearchCols.length ; i<iLen ; i++ )
            {
                oSettings.aoPreSearchCols[i].sSearch = "";
            }
              
            /* Redraw */
            oSettings.oApi._fnReDraw( oSettings );
        };

        /* API method to get paging information */
        $.fn.dataTableExt.oApi.fnPagingInfo = function ( oSettings )
        {
            return {
                "iStart":         oSettings._iDisplayStart,
                "iEnd":           oSettings.fnDisplayEnd(),
                "iLength":        oSettings._iDisplayLength,
                "iTotal":         oSettings.fnRecordsTotal(),
                "iFilteredTotal": oSettings.fnRecordsDisplay(),
                "iPage":          oSettings._iDisplayLength === -1 ?
                    0 : Math.ceil( oSettings._iDisplayStart / oSettings._iDisplayLength ),
                "iTotalPages":    oSettings._iDisplayLength === -1 ?
                    0 : Math.ceil( oSettings.fnRecordsDisplay() / oSettings._iDisplayLength )
            };
        };
        /* Bootstrap style pagination control */
        $.extend( $.fn.dataTableExt.oPagination, {
            "bootstrap": {
                "fnInit": function( oSettings, nPaging, fnDraw ) {
                    var oLang = oSettings.oLanguage.oPaginate;
                    var fnClickHandler = function ( e ) {
                        e.preventDefault();
                        if ( oSettings.oApi._fnPageChange(oSettings, e.data.action) ) {
                            fnDraw( oSettings );
                        }
                    };

                    $(nPaging).append(
                        '<ul class="pagination">'+
                            '<li class="prev disabled"><a href="#"><i class="fa fa-caret-left"></i> '+oLang.sPrevious+'</a></li>'+
                            '<li class="next disabled"><a href="#">'+oLang.sNext+' </a></li>'+
                        '</ul>'
                    );
                    var els = $('a', nPaging);
                    $(els[0]).bind( 'click.DT', { action: "previous" }, fnClickHandler );
                    $(els[1]).bind( 'click.DT', { action: "next" }, fnClickHandler );
                },

                "fnUpdate": function ( oSettings, fnDraw ) {
                    var iListLength = 5;
                    var oPaging = oSettings.oInstance.fnPagingInfo();
                    var an = oSettings.aanFeatures.p;
                    var i, ien, j, sClass, iStart, iEnd, iHalf=Math.floor(iListLength/2);

                    if ( oPaging.iTotalPages < iListLength) {
                        iStart = 1;
                        iEnd = oPaging.iTotalPages;
                    }
                    else if ( oPaging.iPage <= iHalf ) {
                        iStart = 1;
                        iEnd = iListLength;
                    } else if ( oPaging.iPage >= (oPaging.iTotalPages-iHalf) ) {
                        iStart = oPaging.iTotalPages - iListLength + 1;
                        iEnd = oPaging.iTotalPages;
                    } else {
                        iStart = oPaging.iPage - iHalf + 1;
                        iEnd = iStart + iListLength - 1;
                    }

                    for ( i=0, ien=an.length ; i<ien ; i++ ) {
                        // Remove the middle elements
                        $('li:gt(0)', an[i]).filter(':not(:last)').remove();

                        // Add the new list items and their event handlers
                        for ( j=iStart ; j<=iEnd ; j++ ) {
                            sClass = (j==oPaging.iPage+1) ? 'class="active"' : '';
                            $('<li '+sClass+'><a href="#">'+j+'</a></li>')
                                .insertBefore( $('li:last', an[i])[0] )
                                .bind('click', function (e) {
                                    e.preventDefault();
                                    oSettings._iDisplayStart = (parseInt($('a', this).text(),10)-1) * oPaging.iLength;
                                    fnDraw( oSettings );
                                } );
                        }

                        // Add / remove disabled classes from the static elements
                        if ( oPaging.iPage === 0 ) {
                            $('li:first', an[i]).addClass('disabled');
                        } else {
                            $('li:first', an[i]).removeClass('disabled');
                        }

                        if ( oPaging.iPage === oPaging.iTotalPages-1 || oPaging.iTotalPages === 0 ) {
                            $('li:last', an[i]).addClass('disabled');
                        } else {
                            $('li:last', an[i]).removeClass('disabled');
                        }
                    }
                }
            }
        } );


        /*
         * TableTools Bootstrap compatibility
         * Required TableTools 2.1+
         */
        if ( $.fn.DataTable.TableTools ) {
            // Set the classes that TableTools uses to something suitable for Bootstrap
            $.extend( true, $.fn.DataTable.TableTools.classes, {
                "container": "DTTT btn-group",
                "buttons": {
                    "normal": "btn",
                    "disabled": "disabled"
                },
                "collection": {
                    "container": "DTTT_dropdown dropdown-menu",
                    "buttons": {
                        "normal": "",
                        "disabled": "disabled"
                    }
                },
                "print": {
                    "info": "DTTT_print_info modal"
                },
                "select": {
                    "row": "active"
                }
            } );

            // Have the collection use a bootstrap compatible dropdown
            $.extend( true, $.fn.DataTable.TableTools.DEFAULTS.oTags, {
                "collection": {
                    "container": "ul",
                    "button": "li",
                    "liner": "a"
                }
            } );
        }

        /**
         * Default sort: Date (col 3), newest first
         */
        $('#jobPostings').dataTable( {
            "bProcessing": true,
            "sAjaxSource": settings.urls.getNotificationsUrl,
            "sAjaxDataProp": "feed",
            "aaSorting": [[ 3, "desc" ]],
            "aoColumnDefs": [
                {
                    "bSortable": false,
                    "aTargets": [ 0, 1 ]
                },
                {
                    "aTargets": [ 0 ],
                    "sWidth": "10%",
                    "mData": "attributes.status",
                    "mRender": function ( data, type, full ) {
                        if (data[0].toLowerCase() === 'open') {
                            return '<a href="' + full.url + '" target="_blank" class="btn btn-sm btn-success">Apply</a>';
                        } else {
                            return 'Apply in Person';//data[0].toLowerCase();
                        }
                    },
                    "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                        if (oData.attributes.status !== 'open') {
                            $(nTd).addClass('small-text');
                        }
                    }

                },
                {
                    "aTargets": [ 1 ],
                    "sWidth": "5%",
                    "mData": "favorite",
                    "sClass": "favorite hidden-xs",
                    "mRender": function ( data, type, full ) {
                        var favClass, linkTitle;
                        if (full.attributes.status[0].toLowerCase() === 'open') {
                            var url = settings.urls.invokeActionUrlTemplate.replace(/NOTIFICATIONID/,full.id).replace(/ACTIONID/, 'FavoriteAction');
                            if (data === true) {
                                return '<span class="sr-only">' + data + '</span><a href="' + url + '" title="Remove from saved jobs"><i class="fa fa-star"></i></a>';
                            } else {
                                return '<span class="sr-only">' + data + '</span><a href="' + url + '" title="Add to saved jobs"><i class="fa fa-star-o"></i></a>';
                            }
                        } else {
                            return '';
                        }
                    }
                },
                {
                    "aTargets": [ 2 ],
                    "sWidth": "30%",
                    "mData": "title",
                    "mRender": function( data, type, full ) {
                        return '<a href="' + full.id + '" title="' + full.linkText + '" class="jobDetailsLink" >' + data + '</a>';
                    }
                },
                {
                    "aTargets": [ 3 ],
                    "sWidth": "10%",
                    "sClass": "hidden-xs",
                    "mData": "attributes.postDate",
                    "mRender": function( data, type, full ) {
                        //var d = Date.parse(data);
                        return data[0];
                        // return data + '('+d+')';
                    }
                },
                {
                    "aTargets": [ 4 ],
                    "sWidth": "15%",
                    "mData": "id",
                    "sClass": "hidden-xs hidden-sm",
                    "mRender": function (data, type, full) {
                        return data;
                    }
                },
                {
                    "aTargets": [ 5 ],
                    "mData": "attributes.department",
                    "sClass": "hidden-xs"
                },
                {
                    "aTargets": [ 6 ],
                    "sWidth": "30%",
                    "mData": "attributes.category",
                    "bVisible": false
                },
            ],
            "fnInitComplete": function(oSettings, json) {

                $('.searchControls :checkbox').change(function(e) {
                    if ($(this).is(':checked')) {
                        cbArray.push(this.value);
                    } else {
                        arrayPop(this.value, cbArray);
                    }

                    if (cbArray.length > 0) {
                        var a = cbArray.join();
                        oTable.fnFilter(
                            cbArray.join('|'),
                            null,
                            true,
                            false
                        );

                    } else {
                        clearFilter();
                    }

                });

                $('#searchTerms').keyup(function(e) {
                    // var oTable = $('#jobPostings').dataTable();

                    oTable.fnFilter(this.value, 2);
                });

                $( "#jobPostings" ).delegate( "td.favorite a", "click", function(e) {
                    e.preventDefault();
                    toggleFavorite(this);
                });

                $('.jobDetailsLink').click(function(e) {
                    e.preventDefault();
                    displayJob($(this).closest('tr')[0]);
                });

                $('.primary-nav').click(function(e) {
                    e.preventDefault();
                    var action = e.target.getAttribute("data-action");
                    var el = $(e.target);
                    // Remove active class from all elements
                    $('.primary-nav').children().removeClass('active');
                    // Apply acative class to selected element
                    el.parent().addClass('active');

                    switch (action) {
                        case 'search':
                            clearFilter();
                            break;
                        case 'saved':
                            oTable.fnFilter('true', 1);
                            break;
                        default:
                            clearFilter();
                            break;
                    }
                });
                
                removeLoadingOverlay();
            }
        } );
    };

    // initialization *******
    ( function init () {
        // console.warn('jobPostings init');
    })();

    // public API *******
    return {
        init: function (myjQuery, myUnderscore, args) {
            _ = myUnderscore;
            $ = myjQuery;
            if (args) {
                settings.urls = args;
                handshake();
                initTable();
                oTable = $('#jobPostings').dataTable();
            }
        },
        clearFilter: function() {
            clearFilter();
        },
        getTable: function() {
            return(oTable);
        }
    };
}();
