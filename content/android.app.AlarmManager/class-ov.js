$("#tool input").change(function(){ generate(); }).keyup(function(){ generate(); });;
generate();

function c(i){
    if($(i + ":checked").length == 0)
        return false;
    return true;
}

function generate(){
    code = "Calendar calendar = Calendar.getInstance();\n";
    code += "calendar.setTimeInMillis(System.currentTimeMillis());\n";
    if($("#hours").val() != ""){
        code += "calendar.add(Calendar.HOUR, " + $("#hours").val() + ");\n"; 
    } if($("#mins").val() != ""){
        code += "calendar.add(Calendar.MINUTE, " + $("#mins").val() + ");\n"; 
    } if($("#secs").val() != ""){
        code += "calendar.add(Calendar.SECOND, " + $("#secs").val() + ");\n"; 
    }
    code += "alm.set";
    if(c("#repeat")){
        code += "Repeating";
    } else if(c("#repeat_in")){
        code += "InexactRepeating";
    }
    code += "(AlarmManager.RTC, getTimeInMillis()";
    if(c("#once")){
        $("#repeatopts").hide(200);
    } else{
        code += ", ";
        if(c("#in_hour")){
            code += "AlarmManager.INTERVAL_HOUR";
        } else if(c("#in_hhour")){
            code += "AlarmManager.INTERVAL_HALF_HOUR";
        } else if(c("#in_15")){
            code += "AlarmManager.INTERVAL_FIFTEEN_MINUTES";
        } else if(c("#in_day")){
            code += "AlarmManager.INTERVAL_DAY";
        } else if(c("#in_hday")){
            code += "AlarmManager.INTERVAL_HALF_DAY";
        }
        $("#repeatopts").show(200);
    }
    code += ", pendingIntent);";
    $("#thecode").html(code);
}
