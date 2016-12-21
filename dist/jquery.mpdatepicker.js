;
(function ($) {

    $.fn.mpdatepicker = function (options) {

        $.mpdt = this;

        var settings = $.extend({
            modal_bg: 'rgba(0,0,0,0.5)',
            datepicker_bg: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAXCAYAAAALHW+jAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4AsWCCkyWrAXowAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAAJDSURBVDjLnZU9a1RREIaf2b2ra9gFU6g5uLEwIgoBBRWsRFSiweYq/gIbQSsFDVpIQBSsxMKf4AcIcgoRRFGLIGJnExU/ihQeTSlKkt14x2YOHC53N9Epdnlnzpk795135kKFOa+XndcGfcx53ei8TjmvUo7V+ty5AWynvx0BrgKrTgjQGxBbBjTkUpQD4rx2gPdAqxQrBjxQ4/3E9x0YrwGXSsnG7f8k0K1I9ge4BvwGziT+EeB8DdhQunDY+CmANRUJ68BH4CawtxRrifM6BRyqeCVhsFWdeZQBXyr4+1+by4yrU8B8KjXgW1JB2zq7kKhjkzUiNmgzcDt2cSbk0gG2AVuAzyGX0QRfB04DW823C5gDxgyPWkGaJRIh5LJok6AlvAz0Qi5dww2rbCnkouZbUdj9tDfQJ87rXWACeG0PUOv6MyAzPAb8SnjOgAPAS4sXwDHgTmbEzwMPTHfLpq/7wDrDx4EAvLPzTWAP8DAZxYOA4Lzec16fl7bJhxK+4LxOJrjtvH6NvJnvh/N66184lNX4YpcbzusQsNa2TN15zUx/PXv1lvO63pK0je9hU0QvJs+M0N1GcGxKB5ixuVUb/EXgYjLPI8DTpNvDUYd14E3I5WjCx2zIZX+CzwKzIZdXhgX4FHLZl5wJgMSK6iss3iYwlG4VoFb6BNTij8RJGSDYLrCU4AWgiFOSbh9xXqeBc8ALq7QAJoHHQMPwDuCnLYPI/QTwJBndE8AVcV6btix3JpWWd13V7kt9ArwFpv8Ctt/A5Glz+/0AAAAASUVORK5CYII=',
            fontStyle: null,
            gSpliter: '-',
            timePicker: null
        }, options);


        this.persian_month_names = ['', 'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];




        this.getPersianWeekDay = function (jdate) {
            var tmp = (this.Persian2Gregorian(this.exploiter(jdate)));
            var dd = new Date(tmp + " 00:00:00").getDay() + 1;
            if (dd > 6) {
                dd -= 7;
            }
            return dd;
        };


        this.WriteCSS = function () {

            $("#mpdatepicker-modal").css({
                "background": settings.modal_bg
            });


            $(' <style>' +
                    '.mpdatepicker {background-image: url(' + settings.datepicker_bg + ') !important;}' +
                    ' <style>').appendTo("head");


        }


        this.make2number = function (instr) {
            var newstr = instr.toString();
            return newstr.length == 2 ? newstr : '0' + newstr;
        }

        this.gDate2Timestamp = function (stri) {
            return  Math.round(new Date(stri + " 00:00:00").getTime() / 1000);
        }

        this.gTimestamp2Date = function (unix_timestamp) {
            var date = new Date(unix_timestamp * 1000);
            return date.getFullYear() + settings.gSpliter + date.getMonth() + 1 + settings.gSpliter + date.getDate();
        }
        this.pDate2Timestamp = function (stri) {
            return  this.gDate2Timestamp(this.imploiter(this.Persian2Gregorian(this.exploiter(stri))));
        }

        this.pTimestamp2Date = function (unix_timestamp) {
            var date = new Date(unix_timestamp * 1000);
            return this.imploiter(this.Gregorian2Persian([date.getFullYear(), date.getMonth() + 1, date.getDate()]));
        }


        this.pGetLastDayMonth = function (mn, yr) {
            last = 29;
            now = this.pDate2Timestamp(yr + '/' + mn + '/' + (29));
            for (var i = 1; i < 4; i++) {
                now += 86400;
                var tmp = this.exploiter(this.pTimestamp2Date(now));
                if (tmp[2] < last) {
                    return last;
                } else {
                    last = tmp[2];
                }
            }
            return last;
        }

        this.ShowMonth = function (mn, yr, pickedday) {

            $.mpdt.thisMonth = parseInt(mn);
            $.mpdt.selectedDate = pickedday;
            $("#mpmonth span").text(this.persian_month_names[parseInt(mn)]);
            $("#mpyear input").val(yr);


            window.mp_last_month = parseInt(mn);
            // 
            var last_day_of_this_month = this.pGetLastDayMonth(mn, yr);
//            get frist day of month week day

            var start_m_weekday = this.getPersianWeekDay(yr + '/' + mn + '/' + '01');



//            today 
            var dtmp = new Date();

            var today = this.imploiter(this.pTimestamp2Date(Math.round(dtmp.getTime() / 1000)));


            var content = '<tr>';

            // show pervius month in calander
            for (var i = 1; i <= start_m_weekday; i++) {
                var tmp = this.pTimestamp2Date(this.pDate2Timestamp(yr + '/' + mn + '/' + '01') - (86400 *
                        (start_m_weekday - i + 1)));
                var tmpx = this.exploiter(tmp);
                content = content + ('<td class="mp-other-month mp-prv">' + this.parseHindi(tmpx[2]) + '</td>');
            }
            //show this month
            for (var i = 1; i <= last_day_of_this_month; i++) {

                tmsmp = this.pDate2Timestamp(yr + '/' + mn + '/' + i);

                // class can add
                var cls = 'selectable';

                // is selected date
                if (yr + '/' + (mn.toString().length == 1 ? '0' + mn : mn) + '/' + (i.toString().length == 1 ? '0' + i : i) == pickedday) {
                    cls = cls + ' mp-picked';
                }
                // is today
                if (today == yr + '/' + (mn.toString().length == 1 ? '0' + mn : mn) + '/' + (i.toString().length == 1 ? '0' + i : i)) {
                    cls = cls + ' mp-today';
                }
                content = content + ('<td class="' + cls + '"  data-timestamp="' + tmsmp
                        + '" data-gdate="' + this.imploiter(this.Persian2Gregorian([yr, mn, i]), settings.gSpliter) + '" title="' +
                        this.pTimestamp2Date(tmsmp) + '">' + this.parseHindi(i) + '</td>');
                if ((i + start_m_weekday) % 7 == 0) {
                    content = content + ('</tr><tr>');
                }


            }

            // last day of month week day
            var end_m_weekday = this.getPersianWeekDay(yr + '/' + mn + '/' + (i - 1));
            // show next month days
            for (var i = 0; i < (6 - end_m_weekday); i++) {
                content = content + ('<td class="mp-other-month mp-nxt">' + this.parseHindi(i + 1) + '</td>');
            }
            content += '</tr>';
            $("#mpdatepicker-block table tbody").html(content);


            $(".selectable").bind('click', function () {
                $.mpdt.targetPicker.val($(this).attr('title'));
                if ($.mpdt.targetPicker.attr('data-gtarget') !== undefined) {
                    $($.mpdt.targetPicker.attr('data-gtarget')).val($(this).attr('data-gdate'))
                }
                
                
//                console.log($($.mpdt.targetPicker.attr('data-gtarget')).hasClass('mptimepick'));
                if ($.mpdt.targetPicker.hasClass('mptimepick')) {
//                    console.log($("#mp-hor").val() + ':' +$("#mp-min").val() + ':' + $("#mp-sec").val() );
                    $.mpdt.targetPicker.val(  
                            $.mpdt.make2number(parseInt( $("#mp-hour").val()) ) + ':' +$.mpdt.make2number(parseInt( $("#mp-min").val())) + ':' + $.mpdt.make2number(parseInt( $("#mp-sec").val())) + '  '+
                            $.mpdt.targetPicker.val()
                            );
                }
                $("#mpdatepicker-modal").fadeOut(200);
            });



            $(".mp-prv").unbind('click.prvmn');
            $(".mp-nxt").unbind('click.nxtmn');
            $(".mp-close").unbind('click.clk');
            $(".mp-clear").unbind('click.clk');
            $(".mp-today").unbind('click.clk');
            $(".mp-prv").bind('click.prvmn', function () {
                var yyyy = parseInt($("#mpyear input").val());
                if ($.mpdt.thisMonth - 1 == 0) {
                    $.mpdt.thisMonth = 13;
                    yyyy++;
                }
                $.mpdt.ShowMonth($.mpdt.thisMonth - 1, yyyy, $.mpdt.selectedDate);
            });
            $(".mp-nxt").bind('click.nxtmn', function () {
                var yyyy = parseInt($("#mpyear input").val());
                if ($.mpdt.thisMonth + 1 == 13) {
                    $.mpdt.thisMonth = 0;
                    yyyy--;
                }
                $.mpdt.ShowMonth($.mpdt.thisMonth + 1, yyyy, $.mpdt.selectedDate);
            });

            $(".mp-clear").bind('click.clk', function () {
                $.mpdt.targetPicker.val('');
                $.mpdt.selectedDate = '';
                $("#mpdatepicker-modal").fadeOut(200);
            });
            $(".mp-today").bind('click.clk', function () {
                var dtmp = new Date();
                var today = ($.mpdt.pTimestamp2Date(Math.round(dtmp.getTime() / 1000)));
                $.mpdt.targetPicker.val(today);
                $("#mpdatepicker-modal").fadeOut(200);
            });
            $(".mp-close").bind('click.clk', function () {
                $("#mpdatepicker-modal").fadeOut(200);
            });

        }


        this.AddDatepcikerBlock = function () {

            // add header and body of calendar 
            $("#mpdatepicker-modal").append('<div id="mpdatepicker-block"><div class="mpbtn mpfleft mp-nxt" >&rsaquo;</div> ' +
                    ' <div class="mpbtn mpfright mp-prv" >&lsaquo;</div><div class="mpheader"><div id="mpmonth"> <ul></ul> <span> اردیبهشت </span>  </div> <div id="mpyear">  <input type="number" value="1396" /> </div>   </div> ' +
                    '<table> <thead> <th> ش </th><th> ی </th><th> د </th><th> س  </th><th> چ </th><th> پ </th><th> ج</th> </thead> <tbody></tbody> </table>' +
                    '<div class="mp-footer"> ' +
                    '<div class="mptimepicker"> <input value="0" type="number" id="mp-sec"  min="0"  max="59"  /> : '+
                    ' <input value="0" type="number" id="mp-min"  min="0"  max="59"  />  :'+
                    ' <input value="0" type="number" id="mp-hour"  min="0"  max="23" /> </div>'
                    + ' <a class="mp-clear"> پاک کردن </a> <a class="mp-today"> امروز </a> <a class="mp-close"> بستن </a> </div></div>');

//             console.log($("#mpmonth ul li").length);
            // add persian month ro select in cal

            $(this.persian_month_names).each(function (k, v) {
                if (k !== 0) {
                    $("#mpmonth ul").append("<li data-id='" + k + "'>" + this + " </li>");
                }
            });


            // set select month event
            $("#mpmonth ul li").bind('click.select', function () {
                var text = $.trim($(this).text());
                $("#mpmonth span").text(text);
                $.mpdt.ShowMonth($(this).attr('data-id'), $("#mpyear input").val(), $.mpdt.selectedDate);
                $("#mpmonth ul").slideUp(100);
            });
            // set select month event
            $("#mpyear input").bind('change.select click.select', function () {
                $.mpdt.ShowMonth(window.mp_last_month, $(this).val(), $.mpdt.selectedDate);
            });


            // select day event
            $("#mpmonth span").bind('click.monthselect', function () {
                $("#mpmonth ul").slideDown(200);
            });

        };

        this.MakeModalBg = function () {
            // check is modal exists
            if ($("#mpdatepicker-modal").length == 0) {
                //it doesn't exist
                $('body').append('<div id="mpdatepicker-modal" ></div>');
                $.mpdt.AddDatepcikerBlock();
            }



            $("#mpdatepicker-modal").bind('click.close', function (e) {
                if ($(e.target).is(this)) {
                    $(this).fadeOut(400);
                }
            });
        };

        /**
         *  from parsi date by mobin ghasem pour 
         * @param {integer} year
         * @returns {Boolean}
         */
        this.IsLeapYear = function (year) {
            if (((year % 4) == 0 && (year % 100) != 0) || ((year % 400) == 0) && (year % 100) == 0)
                return true;
            else
                return false;
        };


        this.parseHindi = function (str) {

            var r = str.toString();
            var org = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
            var hindi = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
            for (var ch in org) {
                r = r.replace(new RegExp(org[ch], 'g'), hindi[ch]);
            }

            return r;
        }


        this.exploiter = function (date_txt, determ) {
            if (determ === undefined) {
                determ = '/';
            }
            var a = date_txt.split(determ);

            if (a[0].length < a[2].length) {
                return [a[2], a[1], a[0]];
            }

            return a;
        };
        this.imploiter = function (date_txt, determ) {
            if (determ === undefined) {
                determ = '/';
            }

            return date_txt[0] + determ + date_txt[1] + determ + date_txt[2];
        };


        /**
         * from parsi date by mobin ghasem pour 
         * @param {Array} indate
         * @returns {Array}
         */
        this.Persian2Gregorian = function (indate) {
            var jy = indate[0];
            var jm = indate[1];
            var jd = indate[2];
            var gd;
            j_days_sum_month = [0, 0, 31, 62, 93, 124, 155, 186, 216, 246, 276, 306, 336, 365];
            g_days_in_month = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
            g_days_leap_month = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
            gd = j_days_sum_month[parseInt(jm)] + parseInt(jd);
            gy = parseInt(jy) + 621;
            if (gd > 286)
                gy++;
            if (this.IsLeapYear(gy - 1) && 286 < gd)
                gd--;
            if (gd > 286)
                gd -= 286;
            else
                gd += 79;
            if (this.IsLeapYear(gy)) {
                for (gm = 0; gd > g_days_leap_month[gm]; gm++) {
                    gd -= g_days_leap_month[gm];
                }
            } else {
                for (gm = 0; gd > g_days_in_month[gm]; gm++)
                    gd -= g_days_in_month[gm];
            }
            gm++;
            if (gm < 10)
                gm = '0' + gm;
            return [gy, gm, gd];
        };


        /**
         * from parsi date by mobin ghasem pour 
         * @param {Array} indate
         * @returns {Array}
         */
        this.Gregorian2Persian = function (indate) {

            var gy = indate[0];
            var gm = indate[1];
            var gd = indate[2];

            j_days_in_month = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29];
            g_days_sum_month = [0, 0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334, 365];
            dayofyear = g_days_sum_month[parseInt(gm)] + parseInt(gd);
            leab = this.IsLeapYear(gy);
            leap = this.IsLeapYear(gy - 1);
            if (dayofyear > 79) {
                jd = (leab ? dayofyear - 78 : dayofyear - 79);
                jy = gy - 621;
                for (i = 0; jd > j_days_in_month[i]; i++)
                    jd -= j_days_in_month[i];
            } else {
                jd = ((leap || (leab && gm > 2)) ? 287 + dayofyear : 286 + dayofyear);
                jy = gy - 622;
                if (leap == 0 && jd == 366)
                    return [jy, 12, 30];
                for (i = 0; jd > j_days_in_month[i]; i++)
                    jd -= j_days_in_month[i];
            }
            jm = ++i;
            jm = (jm < 10 ? jm = '0' + jm : jm);
            if (jm == 13) {
                jm = 12;
                jd = 30;
            }
            if (jm.toString().length == 1) {
                jm = '0' + jm;
            }
            if (jd.toString().length == 1) {
                jd = '0' + jd;
            }
            return [jy.toString(), jm, jd];
        };


        this.each(function () {
            $(this).addClass('mpdatepicker');

            console.log(settings.timePicker);
            if (settings.timePicker) {
                $(this).addClass('mptimepick');
            }


            $(this).bind('focus.open', function () {
                $("#mpdatepicker-modal").fadeIn(400);

                if ($(this).val() == '') {
                    

                    
                    var dtmp = new Date();
                    var today = ($.mpdt.pTimestamp2Date(Math.round(dtmp.getTime() / 1000)));
//                    $(this).val(today);
                    var vd = $.mpdt.exploiter(today);
                } else {

                    var newval = $.mpdt.exploiter(' ',$(this).val());
                    
                    if (newval.length == 1) {
                        var currentDay = $(this).val() ;
                    }else {
                        var currentDay = newval[1];
                    }
                    var vd = $.mpdt.exploiter(currentDay);
                }
                
                if ($(this).hasClass('mptimepick')){
                    $(".mptimepicker").show();
                }else{
                    $(".mptimepicker").hide();
                }

//                console.log(vd);
                $.mpdt.ShowMonth(vd[1], vd[0], $(this).val());
                $.mpdt.selectedDate = $(this).val();
                $.mpdt.targetPicker = $(this);


            });



            $.mpdt.MakeModalBg();

            $.mpdt.WriteCSS();


        });


    };

}(jQuery));

