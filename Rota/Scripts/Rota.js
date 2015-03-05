function CompareWithPastRow($compareRow, $newRow) {
    var equalCounter = 0;

    var firstDate, secondDate;

    var $analyseColumn = $newRow.find('td[class="aDate"]');
    var $testColumn = $newRow.find('td[class="tDate"]');
    var $developmentColumn = $newRow.find('td[class="dDate"]');
    var $productionColumn = $newRow.find('td[class="pDate"]');

    firstDate = $newRow.children('td.aDate').text();
    secondDate = $compareRow.children('td.aDate').text();
    if (CompareDates(firstDate, secondDate) == "first")
        $analyseColumn.addClass("alert alert-success");
    else if (CompareDates(firstDate, secondDate) == "second")
        $analyseColumn.addClass("alert alert-danger");
    else
        equalCounter++;

    firstDate = $newRow.children('td.tDate').text();
    secondDate = $compareRow.children('td.tDate').text();
    if (CompareDates(firstDate, secondDate) == "first")
        $testColumn.addClass("alert alert-success");
    else if (CompareDates(firstDate, secondDate) == "second")
        $testColumn.addClass("alert alert-danger");
    else
        equalCounter++;

    firstDate = $newRow.children('td.dDate').text();
    secondDate = $compareRow.children('td.dDate').text();
    if (CompareDates(firstDate, secondDate) == "first")
        $developmentColumn.addClass("alert alert-success");
    else if (CompareDates(firstDate, secondDate) == "second")
        $developmentColumn.addClass("alert alert-danger");
    else
        equalCounter++;

    firstDate = $newRow.children('td.pDate').text();
    secondDate = $compareRow.children('td.pDate').text();
    if (CompareDates(firstDate, secondDate) == "first")
        $productionColumn.addClass("alert alert-success");
    else if (CompareDates(firstDate, secondDate) == "second")
        $productionColumn.addClass("alert alert-danger");
    else
        equalCounter++;

    return equalCounter;
};

function GetClearDate(date) {
    var subDate = date.split("T")[0];
    var splits = subDate.split("-");

    for (var i = 0; i < splits.length; i++) {
        if (splits[i].indexOf("0") == 0)
            splits[i] = splits[i].substring(1, 2);
    }
    return splits[2] + "." + splits[1] + "." + splits[0];
};

function HandleData(data) {
    var result = JSON.parse(data.projectlist);
    var $parentTR;
    var count = 0;
    jQuery.each(result, function (index) {
        $parentTR = $("#" + result[index].ProjectId).closest('tr');
        var $nextRow = $parentTR.closest('tr').next();
        var $compareRow = null;
        if ($nextRow.attr('class') == "no")
            $compareRow = $nextRow;
        var firstDate, secondDate;
        var $newRow = $parentTR.clone();
        $newRow.removeClass("odd").removeAttr("id").addClass("no");

        InsertDataToRow(result[index], $newRow);

        SetNameColumn(result[index].UpdateDate, $newRow);

        //tümü eşitse göstermemek için
        var equalCounter = 0;
        if ($compareRow != null) {
            equalCounter = CompareWithPastRow($compareRow, $newRow);
        }
        if (equalCounter != 4) {
            $newRow.attr("onclick", "CloseRow($(this))");
            $newRow.insertAfter($parentTR);
            count++;
        }
    });
    if (count == 0)
        return;

    var $nextRow = $parentTR.closest('tr').next();
    var $compareRow = null;
    if ($nextRow.attr('class') == "no")
        $compareRow = $nextRow;
    var firstDate, secondDate;

    if ($compareRow != null) {
        CompareWithPastRow($compareRow, $parentTR);
    }
};


function SetNameColumn(data, $newRow) {
    var $nameColumn = $newRow.find('td[class="pName"]');
    $nameColumn.empty();
    $nameColumn.text(GetClearDate(data) + " tarihli değişiklik");
    $nameColumn.attr("data-title", "Geçmiş");
    $nameColumn.attr("style", "font-style: italic; font-weight: normal;");
};

function CloseRow($row) {
    $row.prevUntil(".odd").andSelf().toggle();
    $row.nextUntil(".odd").toggle();
    $row.prevAll(".odd").first().find(".arrow").toggleClass("up");
};



var monthNames = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
"Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];

function ChangeDateToMonth(date) {
    var splits = date.split('.');
    return monthNames[splits[1] - 1] + " " + splits[2];

};


function searchStringInMonths(str) {
    for (var j = 0; j < monthNames.length; j++) {
        if (monthNames[j].match(str)) return j + 1;
    }
    return -1;
}

function GetProjectDetailWithAjax(id) {
    $.ajax({
        type: 'GET',
        url: '/Rota/GetProjectData/' + id,
        success: function (data) {
            HandleData(data);

        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown, url);
        }
    });
};



function ChangeDateToQuarter(date) {
    var splits = date.split('.');
    return "Q" + (Math.floor(((splits[1] - 1) / 3)) + 1) + " " + splits[2];

};