/**
 * Created by xiaoru_zhu on 2018/5/12.
 */
//window.histrory.go(0);
var predict_rst = '0.00';

var neighbor_features = {'BATH BEACH': 0, 'BAY RIDGE': 1, 'BEDFORD STUYVESANT': 2, 'BENSONHURST': 3, 'BERGEN BEACH': 4, 'BOERUM HILL': 5, 'BOROUGH PARK': 6, 'BRIGHTON BEACH': 7, 'BROOKLYN HEIGHTS': 8, 'BROOKLYN-UNKNOWN': 9, 'BROWNSVILLE': 10, 'BUSH TERMINAL': 11, 'BUSHWICK': 12, 'CANARSIE': 13, 'CARROLL GARDENS': 14, 'CLINTON HILL': 15, 'COBBLE HILL': 16, 'COBBLE HILL-WEST': 17, 'CONEY ISLAND': 18, 'CROWN HEIGHTS': 19, 'CYPRESS HILLS': 20, 'DOWNTOWN-FULTON FERRY': 21, 'DOWNTOWN-FULTON MALL': 22, 'DOWNTOWN-METROTECH': 23, 'DYKER HEIGHTS': 24, 'EAST NEW YORK': 25, 'FLATBUSH-CENTRAL': 26, 'FLATBUSH-EAST': 27, 'FLATBUSH-LEFFERTS GARDEN': 28, 'FLATBUSH-NORTH': 29, 'FLATLANDS': 30, 'FORT GREENE': 31, 'GERRITSEN BEACH': 32, 'GOWANUS': 33, 'GRAVESEND': 34, 'GREENPOINT': 35, 'KENSINGTON': 36, 'MADISON': 37, 'MANHATTAN BEACH': 38, 'MARINE PARK': 39, 'MIDWOOD': 40, 'MILL BASIN': 41, 'NAVY YARD': 42, 'OCEAN HILL': 43, 'OCEAN PARKWAY-NORTH': 44, 'OCEAN PARKWAY-SOUTH': 45, 'OLD MILL BASIN': 46, 'PARK SLOPE': 47, 'PARK SLOPE SOUTH': 48, 'PROSPECT HEIGHTS': 49, 'RED HOOK': 50, 'SEAGATE': 51, 'SHEEPSHEAD BAY': 52, 'SUNSET PARK': 53, 'WILLIAMSBURG-CENTRAL': 54, 'WILLIAMSBURG-EAST': 55, 'WILLIAMSBURG-NORTH': 56, 'WILLIAMSBURG-SOUTH': 57, 'WINDSOR TERRACE': 58, 'WYCKOFF HEIGHTS': 59, 'ALPHABET CITY': 60, 'CHELSEA': 61, 'CHINATOWN': 62, 'CIVIC CENTER': 63, 'CLINTON': 64, 'EAST VILLAGE': 65, 'FASHION': 66, 'FINANCIAL': 67, 'FLATIRON': 68, 'GRAMERCY': 69, 'GREENWICH VILLAGE-CENTRAL': 70, 'GREENWICH VILLAGE-WEST': 71, 'HARLEM-CENTRAL': 72, 'HARLEM-EAST': 73, 'HARLEM-UPPER': 74, 'HARLEM-WEST': 75, 'INWOOD': 76, 'JAVITS CENTER': 77, 'KIPS BAY': 78, 'LITTLE ITALY': 79, 'LOWER EAST SIDE': 80, 'MANHATTAN VALLEY': 81, 'MANHATTAN-UNKNOWN': 82, 'MIDTOWN CBD': 83, 'MIDTOWN EAST': 84, 'MIDTOWN WEST': 85, 'MORNINGSIDE HEIGHTS': 86, 'MURRAY HILL': 87, 'SOHO': 88, 'SOUTHBRIDGE': 89, 'TRIBECA': 90, 'UPPER EAST SIDE (59-79)': 91, 'UPPER EAST SIDE (79-96)': 92, 'UPPER EAST SIDE (96-110)': 93, 'UPPER WEST SIDE (59-79)': 94, 'UPPER WEST SIDE (79-96)': 95, 'UPPER WEST SIDE (96-116)': 96, 'WASHINGTON HEIGHTS LOWER': 97, 'WASHINGTON HEIGHTS UPPER': 98, 'AIRPORT LA GUARDIA': 99, 'ARVERNE': 100, 'ASTORIA': 101, 'BAYSIDE': 102, 'BEECHHURST': 103, 'BELLE HARBOR': 104, 'BELLEROSE': 105, 'BRIARWOOD': 106, 'BROAD CHANNEL': 107, 'CAMBRIA HEIGHTS': 108, 'COLLEGE POINT': 109, 'CORONA': 110, 'DOUGLASTON': 111, 'EAST ELMHURST': 112, 'ELMHURST': 113, 'FAR ROCKAWAY': 114, 'FLORAL PARK': 115, 'FLUSHING-NORTH': 116, 'FLUSHING-SOUTH': 117, 'FOREST HILLS': 118, 'FRESH MEADOWS': 119, 'GLEN OAKS': 120, 'GLENDALE': 121, 'HAMMELS': 122, 'HILLCREST': 123, 'HOLLIS': 124, 'HOLLIS HILLS': 125, 'HOLLISWOOD': 126, 'HOWARD BEACH': 127, 'JACKSON HEIGHTS': 128, 'JAMAICA': 129, 'JAMAICA BAY': 130, 'JAMAICA ESTATES': 131, 'JAMAICA HILLS': 132, 'KEW GARDENS': 133, 'LAURELTON': 134, 'LITTLE NECK': 135, 'LONG ISLAND CITY': 136, 'MASPETH': 137, 'MIDDLE VILLAGE': 138, 'NEPONSIT': 139, 'OAKLAND GARDENS': 140, 'OZONE PARK': 141, 'QUEENS VILLAGE': 142, 'REGO PARK': 143, 'RICHMOND HILL': 144, 'RIDGEWOOD': 145, 'ROCKAWAY PARK': 146, 'ROSEDALE': 147, 'SO. JAMAICA-BAISLEY PARK': 148, 'SOUTH JAMAICA': 149, 'SOUTH OZONE PARK': 150, 'SPRINGFIELD GARDENS': 151, 'ST. ALBANS': 152, 'SUNNYSIDE': 153, 'WHITESTONE': 154, 'WOODHAVEN': 155, 'WOODSIDE': 156};
var class_category_features = {'01 ONE FAMILY DWELLINGS': 0, '02 TWO FAMILY DWELLINGS': 1, '03 THREE FAMILY DWELLINGS': 2, '05 TAX CLASS 1 VACANT LAND': 3, '07 RENTALS - WALKUP APARTMENTS': 4, '14 RENTALS - 4-10 UNIT': 5, '22 STORE BUILDINGS': 6, '32 HOSPITAL AND HEALTH FACILITIES': 7, '08 RENTALS - ELEVATOR APARTMENTS': 8, '21 OFFICE BUILDINGS': 9, '27 FACTORIES': 10, '29 COMMERCIAL GARAGES': 11, '30 WAREHOUSES': 12, '06 TAX CLASS 1 - OTHER': 13, '09 COOPS - WALKUP APARTMENTS': 14, '37 RELIGIOUS FACILITIES': 15, '36 OUTDOOR RECREATIONAL FACILITIES': 16, '41 TAX CLASS 4 - OTHER': 17, '11 SPECIAL CONDO BILLING LOTS': 18, '33 EDUCATIONAL FACILITIES': 19, '38 ASYLUMS AND HOMES': 20, '23 LOFT BUILDINGS': 21, '39 TRANSPORTATION FACILITIES': 22, '35 INDOOR PUBLIC AND CULTURAL FACILITIES': 23, '31 COMMERCIAL VACANT LAND': 24, '10 COOPS - ELEVATOR APARTMENTS': 25, '11A CONDO-RENTALS': 26, '26 OTHER HOTELS': 27, '34 THEATRES': 28, '25 LUXURY HOTELS': 29, '40 SELECTED GOVERNMENTAL FACILITIES': 30};
var class_present_features =  {'A5': 0, 'S1': 1, 'A1': 2, 'A2': 3, 'A9': 4, 'B1': 5, 'B3': 6, 'B2': 7, 'B9': 8, 'S2': 9, 'C0': 10, 'D6': 11, 'C2': 12, 'C3': 13, 'C1': 14, 'C7': 15, 'S4': 16, 'S9': 17, 'S3': 18, 'K2': 19, 'K1': 20, 'K4': 21, 'I5': 22, 'A4': 23, 'A3': 24, 'C5': 25, 'D1': 26, 'S5': 27, 'O5': 28, 'O7': 29, 'O2': 30, 'O1': 31, 'F9': 32, 'G5': 33, 'E1': 34, 'V1': 35, 'V0': 36, 'G0': 37, 'C4': 38, 'D7': 39, 'C8': 40, 'K9': 41, 'D3': 42, 'F4': 43, 'G1': 44, 'G9': 45, 'G2': 46, 'E9': 47, 'I9': 48, 'I6': 49, 'M1': 50, 'M9': 51, 'D9': 52, 'Q9': 53, 'Z9': 54, 'R0': 55, 'V9': 56, 'F1': 57, 'F5': 58, 'GU': 59, 'W2': 60, 'O8': 61, 'O6': 62, 'I4': 63, 'M4': 64, 'F2': 65, 'N2': 66, 'L9': 67, 'T9': 68, 'C6': 69, 'S0': 70, 'K5': 71, 'G4': 72, 'I7': 73, 'P5': 74, 'M3': 75, 'I1': 76, 'G7': 77, 'P3': 78, 'E2': 79, 'L1': 80, 'W1': 81, 'D4': 82, 'RR': 83, 'G8': 84, 'W3': 85, 'M2': 86, 'W9': 87, 'E7': 88, 'C9': 89, 'P6': 90, 'O9': 91, 'G3': 92, 'H8': 93, 'N9': 94, 'W8': 95, 'P9': 96, 'K7': 97, 'D8': 98, 'D5': 99, 'G6': 100, 'D0': 101, 'O3': 102, 'L8': 103, 'H3': 104, 'W7': 105, 'J5': 106, 'J2': 107, 'O4': 108, 'H2': 109, 'HR': 110, 'L2': 111, 'H1': 112, 'A7': 113, 'H6': 114, 'P7': 115, 'H9': 116, 'D2': 117, 'HS': 118, 'HB': 119, 'J4': 120, 'W6': 121, 'A6': 122, 'A0': 123, 'P2': 124, 'Z0': 125, 'H4': 126, 'GW': 127, 'K6': 128, 'Z1': 129, 'J6': 130, 'N4': 131};
var month_features = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
var month_name = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
/**
 * var opt = document.createElement('option');
    opt.textContent = v.name;
    opt.value = v.name;
    $('#scheduleSelect').append(opt);
 */
/**
 * var $opt = $('<option>');
    $opt.val(v.name).text(v.name);
    $opt.appendTo('#scheduleSelect');
 */

// dynamically append the option in html page
for (var key in neighbor_features) {
    // console.log(key);
    $("#neighbor_area").append("<option value='"+ key +"'>"+ key +"</option>"); // Wrap the value with quotes, since the value contains space.
}

for (var key in class_category_features) {
    $("#class_category").append("<option value='"+ key +"'>"+ key +"</option>");
}

for (var key in class_present_features) {
    $("#class_as_present").append("<option value='"+ key +"'>"+ key +"</option>");
}

for (var v = 0; v < month_features.length; ++v){
    $("#sale_month").append("<option value="+ month_features[v] +">" + month_name[v] + "</option>")
}

function getFormInfo() {
    /*
    var neighbor_area = $("#neighbor_area").val();
    var class_category = $("#class_category").val();
    var class_as_present = $("#class_as_present").val();
    var r_units = $("#r_units").val();
    var c_units = $("#c_units").val();
    var t_units = $("#t_units").val();
    var land_squre = $("#land_squre").val();
    var year_built = $("#year_built").val();
    var sale_month = $("#sale_month").val();
    values = [neighbor_area, class_category, class_as_present, r_units, c_units, land_squre, year_built, sale_month];
    */
    data = $("#form_p").serialize(); // obtain the whole form data from html page by "id"
    //data = JSON.stringify(data);
    //console.log(data)

    $.ajax({
        type: "POST",  // submit form data from html page to backstage
        url: "/exePredict",
        data: data,
        dataType: 'json', // automatically resolve json data from backstage
        success: function(json_data) { // callback function when success receive data from backstage
            var rst_data = json_data; // no need to resolve json data from backstage like "$.parseJSON(json_data)"
            alert("The Predict Value is: " + JSON.stringify(rst_data[0]) + '($/feet^2)');
            predict_rst = JSON.stringify(rst_data[0]);
            $("#rst_num").html(predict_rst); // dynamically modify value in html page by "id"
            $("#rmsle").html(rst_data[1]);
            $("#mae").html(rst_data[2]);
        },
        error: function(xhr, type) {
            alert('Failed to receive the data from backstage.\n')
        }
    });
    return false; // do not refresh when submit form data!!!
}

//$("#rst_num").html('12456.44');

