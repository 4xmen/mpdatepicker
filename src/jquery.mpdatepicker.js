;
(function ($) {

    $.fn.mpdatepicker = function (options) {

        $.mpdt = this;

        let settings = $.extend({
            modal_bg: 'rgba(0,0,0,0.5)',
            datepicker_bg: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAXCAYAAAALHW+jAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4AsWCCkyWrAXowAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAAJDSURBVDjLnZU9a1RREIaf2b2ra9gFU6g5uLEwIgoBBRWsRFSiweYq/gIbQSsFDVpIQBSsxMKf4AcIcgoRRFGLIGJnExU/ihQeTSlKkt14x2YOHC53N9Epdnlnzpk795135kKFOa+XndcGfcx53ei8TjmvUo7V+ty5AWynvx0BrgKrTgjQGxBbBjTkUpQD4rx2gPdAqxQrBjxQ4/3E9x0YrwGXSsnG7f8k0K1I9ge4BvwGziT+EeB8DdhQunDY+CmANRUJ68BH4CawtxRrifM6BRyqeCVhsFWdeZQBXyr4+1+by4yrU8B8KjXgW1JB2zq7kKhjkzUiNmgzcDt2cSbk0gG2AVuAzyGX0QRfB04DW823C5gDxgyPWkGaJRIh5LJok6AlvAz0Qi5dww2rbCnkouZbUdj9tDfQJ87rXWACeG0PUOv6MyAzPAb8SnjOgAPAS4sXwDHgTmbEzwMPTHfLpq/7wDrDx4EAvLPzTWAP8DAZxYOA4Lzec16fl7bJhxK+4LxOJrjtvH6NvJnvh/N66184lNX4YpcbzusQsNa2TN15zUx/PXv1lvO63pK0je9hU0QvJs+M0N1GcGxKB5ixuVUb/EXgYjLPI8DTpNvDUYd14E3I5WjCx2zIZX+CzwKzIZdXhgX4FHLZl5wJgMSK6iss3iYwlG4VoFb6BNTij8RJGSDYLrCU4AWgiFOSbh9xXqeBc8ALq7QAJoHHQMPwDuCnLYPI/QTwJBndE8AVcV6btix3JpWWd13V7kt9ArwFpv8Ctt/A5Glz+/0AAAAASUVORK5CYII=',
            fontStyle: null,
            gSpliter: '-',
            timePicker: null,
            timeChangeSensitivity: 5,
            mainContentId: "#mpdatepicker-modal",
            onOpen: function () {
            },
            onSelect: function (selected) {
            },
            onChange: function (oldVal, newVal) {
            },
            onClose: function () {
            },
        }, options);


        this.persian_month_names = ['', 'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];


        this.getPersianWeekDay = function (jdate) {

            let tmp = this.imploiter(this.Persian2Gregorian(this.exploiter(jdate)), '/');
            let dd = new Date(tmp + " 00:00:00").getDay() + 1;
            if (dd > 6) {
                dd -= 7;
            }
            return dd;
        };


        this.WriteCSS = function () {

            $(settings.mainContentId).css({
                "background": settings.modal_bg
            });


            $(' <style>' +
                '.mpdatepicker { background-image: url(' + settings.datepicker_bg + ') !important;background-repeat: no-repeat !important;}' +
                ' </style>').appendTo("head");


        }


        this.upDownCheck = function (upOrDown, main, sub, max = 59) {
            let val = parseInt($(main).val());
            $(sub + $(main).val()).removeClass('active');
            if (upOrDown) {
                if (val > 0) {
                    val--;
                    $(main).val(val);
                }
            } else {
                if (val < max) {
                    val++;
                    $(main).val(val);
                }
            }
            val *= -1.7049;
            val += 2;
            $(sub + $(main).val()).addClass('active');
            $(sub + $(main).val()).closest('.mp-holder').css('top', val + 'em');
        }

        this.make2number = function (instr) {
            let num = instr.toString();
            return num.length === 2 ? num : '0' + num;
        }

        this.gDate2Timestamp = function (stri) {
            return Math.round(new Date(stri + " 00:00:00").getTime() / 1000);
        }

        this.gTimestamp2Date = function (unix_timestamp) {
            let date = new Date(unix_timestamp * 1000);
            return date.getFullYear() + settings.gSpliter + date.getMonth() + 1 + settings.gSpliter + date.getDate();
        }
        this.pDate2Timestamp = function (stri) {
            return this.gDate2Timestamp(this.imploiter(this.Persian2Gregorian(this.exploiter(stri))));
        }

        this.pTimestamp2Date = function (unix_timestamp) {
            let date = new Date(unix_timestamp * 1000);
            return this.imploiter(this.Gregorian2Persian([date.getFullYear(), date.getMonth() + 1, date.getDate()]));
        }

        this.calcTime = function (time) {
            if ($.mpdt.targetPicker.hasClass('mptimepick')) {
                time += parseInt($("#mp-hour").val()) * 3600;
                time += parseInt($("#mp-min").val()) * 60;
                time += parseInt($("#mp-sec").val());
            }
            return time;
        }

        this.pGetLastDayMonth = function (mn, yr) {
            let tmp;
            let last = 29;
            let now = this.pDate2Timestamp(yr + '/' + mn + '/' + (29));
            for (let i = 1; i < 4; i++) {
                now += 86400;
                tmp = this.exploiter(this.pTimestamp2Date(now));
                if (tmp[2] < last) {
                    return last;
                } else {
                    last = tmp[2];
                }
            }
            return last;
        }

        this.ShowMonth = function (mn, yr, pickedday) {

            let i;
            $.mpdt.thisMonth = parseInt(mn);
            $.mpdt.selectedDate = pickedday;
            $("#mpmonth span").text(this.persian_month_names[parseInt(mn)]);
            $("#mpyear input").val(yr);


            window.mp_last_month = parseInt(mn);
            //
            let last_day_of_this_month = this.pGetLastDayMonth(mn, yr);

            // get frist day of month week day
            let start_m_weekday = this.getPersianWeekDay(yr + '/' + mn + '/' + '01');


            // today
            let dtmp = new Date();
            let today = this.imploiter(this.pTimestamp2Date(Math.round(dtmp.getTime() / 1000)));

            let content = '<tr>';

            // show pervius month in calander
            for (i = 1; i <= start_m_weekday; i++) {
                let tmp = this.pTimestamp2Date(this.pDate2Timestamp(yr + '/' + mn + '/' + '01') - (86400 *
                    (start_m_weekday - i + 1)));
                let tmpx = this.exploiter(tmp);
                content = content + ('<td class="mp-other-month mp-prv">' + this.parseHindi(tmpx[2]) + '</td>');
            }
            //show this month
            for (i = 1; i <= last_day_of_this_month; i++) {

                let tmsmp = this.pDate2Timestamp(yr + '/' + mn + '/' + i);

                // class can add
                let cls = 'selectable';

                // is selected date
                if (yr + '/' + (mn.toString().length === 1 ? '0' + mn : mn) + '/' + (i.toString().length === 1 ? '0' + i : i) === pickedday) {
                    cls = cls + ' mp-picked';
                }
                // is today
                let tdCheck = this.Persian2Gregorian([yr, mn, i]);
                if (dtmp.getDate() === parseInt(tdCheck[2]) && dtmp.getMonth() + 1 === parseInt(tdCheck[1]) && dtmp.getFullYear() === parseInt(tdCheck[0])) {
                    cls = cls + ' mp-today-td';
                }
                content = content + ('<td class="' + cls + '"  data-timestamp="' + tmsmp
                    + '" data-gdate="' + this.imploiter(this.Persian2Gregorian([yr, mn, i]), settings.gSpliter) + '" title="' +
                    this.pTimestamp2Date(tmsmp) + '">' + this.parseHindi(i) + '</td>');

                // console.log(i,start_m_weekday);
                if ((i + start_m_weekday) % 7 === 0) {
                    content = content + ('</tr><tr>');
                }

            }

            // last day of month week day
            let end_m_weekday = this.getPersianWeekDay(yr + '/' + mn + '/' + (i - 1));
            // show next month days
            for (let i = 0; i < (6 - end_m_weekday); i++) {
                content = content + ('<td class="mp-other-month mp-nxt">' + this.parseHindi(i + 1) + '</td>');
            }
            content += '</tr>';
            $("#mpdatepicker-block table tbody").html(content);


            $(".selectable").bind('click', function () {
                try {
                    $.mpdt.targetPicker.val($(this).attr('title'));
                    if ($.mpdt.targetPicker.attr('data-gtarget') !== undefined) {
                        $($.mpdt.targetPicker.attr('data-gtarget')).val($(this).attr('data-gdate'))
                    }
                } catch (e) {
                    console.warn('target err');
                }


                let time = $.mpdt.calcTime(parseInt($(this).attr('data-timestamp')));
                if ($.mpdt.targetPicker.hasClass('mptimepick')) {
                    $.mpdt.targetPicker.val(
                        $.mpdt.make2number(parseInt($("#mp-hour").val())) + ':' +
                        $.mpdt.make2number(parseInt($("#mp-min").val())) + ':' +
                        $.mpdt.make2number(parseInt($("#mp-sec").val())) + '  ' +
                        $.mpdt.targetPicker.val()
                    );
                }
                settings.onSelect(time);
                let oldVal;
                if ($.mpdt.targetPicker.attr('data-timestamp') == 'null' || $.mpdt.targetPicker.attr('data-timestamp') === undefined) {
                    oldVal = null;
                } else {
                    oldVal = parseInt($.mpdt.targetPicker.attr('data-timestamp'));
                }
                settings.onChange(oldVal, time);
                $.mpdt.targetPicker.attr('data-timestamp', time);
                settings.onClose();
                $(settings.mainContentId).fadeOut(200);
            });


            $(".mp-prv").unbind('click.prvmn').bind('click.prvmn', function () {
                let yyyy = parseInt($("#mpyear input").val());
                if ($.mpdt.thisMonth - 1 === 0) {
                    $.mpdt.thisMonth = 13;
                    yyyy++;
                }
                $.mpdt.ShowMonth($.mpdt.thisMonth - 1, yyyy, $.mpdt.selectedDate);
            });
            $(".mp-nxt").unbind('click.nxtmn').bind('click.nxtmn', function () {
                let yyyy = parseInt($("#mpyear input").val());
                if ($.mpdt.thisMonth + 1 === 13) {
                    $.mpdt.thisMonth = 0;
                    yyyy--;
                }
                $.mpdt.ShowMonth($.mpdt.thisMonth + 1, yyyy, $.mpdt.selectedDate);
            });

            $(".mp-clear").unbind('click.clk').bind('click.clk', function () {
                $.mpdt.targetPicker.val('');
                $.mpdt.selectedDate = '';
                $(settings.mainContentId).fadeOut(200);
                settings.onSelect(null);
                settings.onClose();
            });
            $(".mp-today").unbind('click.clk').bind('click.clk', function () {
                let dtmp = new Date();
                let today = ($.mpdt.pTimestamp2Date(Math.round(dtmp.getTime() / 1000)));
                let time = $.mpdt.calcTime(Math.round(dtmp.getTime() / 1000));
                settings.onSelect(time);
                let oldVal;
                if ($.mpdt.targetPicker.attr('data-timestamp') == 'null' || $.mpdt.targetPicker.attr('data-timestamp') === undefined) {
                    oldVal = null;
                } else {
                    oldVal = parseInt($.mpdt.targetPicker.attr('data-timestamp'));
                }
                settings.onChange(oldVal, time);
                $.mpdt.targetPicker.attr('data-timestamp', time);

                $.mpdt.targetPicker.val(today);
                if ($.mpdt.targetPicker.hasClass('mptimepick')) {
                    $.mpdt.targetPicker.val(
                        $.mpdt.make2number(parseInt($("#mp-hour").val())) + ':' +
                        $.mpdt.make2number(parseInt($("#mp-min").val())) + ':' +
                        $.mpdt.make2number(parseInt($("#mp-sec").val())) + '  ' +
                        $.mpdt.targetPicker.val()
                    );
                }
                $(settings.mainContentId).fadeOut(200);
                settings.onClose();
            });
            $(".mp-close").unbind('click.clk').bind('click.clk', function () {
                $(settings.mainContentId).fadeOut(200);
                settings.onClose();
            });

        }


        this.AddDatepcikerBlock = function () {

            // add header and body of calendar
            $(settings.mainContentId).append(
                `<div id="mpdatepicker-block"><div class="mpbtn mpfleft mp-nxt" >&rsaquo;</div> 
                 <div class="mpbtn mpfright mp-prv" >&lsaquo;</div><div class="mpheader"><div id="mpmonth"> <ul></ul> <span> اردیبهشت </span>  </div> <div id="mpyear">  <input type="number" value="1396" /> </div>   </div>
                <table> <thead> <th> ش </th><th> ی </th><th> د </th><th> س  </th><th> چ </th><th> پ </th><th> ج</th> </thead> <tbody></tbody> </table>
                <div class="mp-footer"> 
                <div class="mptimepicker">
                     <input value="0" type="hidden" id="mp-sec"  min="0"  max="59"  /> 
                     <input value="0" type="hidden" id="mp-min"  min="0"  max="59"  />  
                     <input value="0" type="hidden" id="mp-hour"  min="0"  max="23" />
                     <div id="mp-select-hour" data-selected="h"><div class="mp-holder"></div></div>
                     <div id="mp-select-min" data-selected="m"><div class="mp-holder"></div></div>
                     <div id="mp-select-sec" data-selected="s"><div class="mp-holder"></div></div>
                 </div> 
                 <a class="mp-clear"> پاک کردن </a> <a class="mp-today"> امروز </a> <a class="mp-close"> بستن </a> </div></div>`
            );


            for (let i = 0; i < 60; i++) {
                if (i < 24) {
                    $("#mp-select-hour .mp-holder").append(`<div class="mp-select-item" id="mp-h-${i}">` + $.mpdt.make2number(i) + `</div>`);
                }
                $("#mp-select-min .mp-holder").append(`<div class="mp-select-item" id="mp-m-${i}">` + $.mpdt.make2number(i) + `</div>`);
                $("#mp-select-sec .mp-holder").append(`<div class="mp-select-item" id="mp-s-${i}">` + $.mpdt.make2number(i) + `</div>`);
            }
            // add persian month ro select in cal

            $(this.persian_month_names).each(function (k, v) {
                if (k !== 0) {
                    $("#mpmonth ul").append("<li data-id='" + k + "'>" + this + " </li>");
                }
            });

            $("#mp-select-hour").bind('mousewheel', function (e) {
                e.preventDefault();
                $.mpdt.upDownCheck(e.originalEvent.wheelDelta > 0, "#mp-hour", '#mp-h-', 23);
            });

            $("#mp-select-min").bind('mousewheel', function (e) {
                e.preventDefault();
                $.mpdt.upDownCheck(e.originalEvent.wheelDelta > 0, "#mp-min", '#mp-m-');
            });

            $("#mp-select-sec").bind('mousewheel', function (e) {
                e.preventDefault();
                $.mpdt.upDownCheck(e.originalEvent.wheelDelta > 0, "#mp-sec", '#mp-s-');
            });

            var startDrag, posY, selectedItem;
            startDrag = false;
            posY = true;

            $("#mp-select-hour,#mp-select-min,#mp-select-sec").bind('mousedown.down', function (e) {
                // dropTarget.addClass('dragging');
                posY = e.pageY;
                startDrag = true;
                selectedItem = $(this).attr('data-selected');
            });
            $(document).bind('mouseup.move', function () {
                startDrag = false;
            });
            $(document).bind('mousemove.up', function (e) {

                if (startDrag &&  Math.abs(posY - e.pageY) > settings.timeChangeSensitivity ) {
                    let booleanUp = (posY > e.pageY);
                    console.log(booleanUp);
                    switch (selectedItem) {
                        case 'h':
                            $.mpdt.upDownCheck(booleanUp, "#mp-hour", '#mp-h-', 23);
                        break;
                        case 'm':
                            $.mpdt.upDownCheck(booleanUp, "#mp-min", '#mp-m-');
                        break;
                        case 's':
                            $.mpdt.upDownCheck(booleanUp, "#mp-sec", '#mp-s-');
                        break;
                    }
                    posY = e.pageY;
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
            if ($(settings.mainContentId).length === 0) {
                //it doesn't exist
                $('body').append('<div id="mpdatepicker-modal" ></div>');
                $.mpdt.AddDatepcikerBlock();
            }


            $(settings.mainContentId).bind('mousedown.close', function (e) {
                if ($(e.target).is(this)) {
                    settings.onClose();
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
            if (((year % 4) === 0 && (year % 100) !== 0) || ((year % 400) === 0) && (year % 100) === 0)
                return true;
            else
                return false;
        };


        this.parseHindi = function (str) {

            let r = str.toString();
            let org = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
            let hindi = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
            for (var ch in org) {
                r = r.replace(new RegExp(org[ch], 'g'), hindi[ch]);
            }

            return r;
        }


        this.exploiter = function (date_txt, determ) {
            if (typeof determ === 'undefined') {
                determ = '/';
            }
            let a = date_txt.split(determ);

            if (typeof a[2] === 'undefined') {
                return a;
            }
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
            let jy = indate[0];
            let jm = indate[1];
            let jd = indate[2];
            let gd;
            let j_days_sum_month = [0, 0, 31, 62, 93, 124, 155, 186, 216, 246, 276, 306, 336, 365];
            let g_days_in_month = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
            let g_days_leap_month = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
            gd = j_days_sum_month[parseInt(jm)] + parseInt(jd);
            let gy = parseInt(jy) + 621;
            if (gd > 286)
                gy++;
            if (this.IsLeapYear(gy - 1) && 286 < gd)
                gd--;
            if (gd > 286)
                gd -= 286;
            else
                gd += 79;
            let gm;
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

            let gy, gm, gd, j_days_in_month, g_days_sum_month, dayofyear, leab, leap, jd, jy, jm, i;

            gy = indate[0];
            gm = indate[1];
            gd = indate[2];

            j_days_in_month = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29];
            g_days_sum_month = [0, 0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334, 365];
            dayofyear = g_days_sum_month[parseInt(gm)] + parseInt(gd);
            leab = this.IsLeapYear(gy);
            leap = this.IsLeapYear(gy - 1);
            if (dayofyear > 79) {
                jd = (leab ? dayofyear - 78 : dayofyear - 79);
                jy = gy - 621;
                for (i = 0; jd > j_days_in_month[i]; i++) {
                    jd -= j_days_in_month[i];
                }
            } else {
                jd = ((leap || (leab && gm > 2)) ? 287 + dayofyear : 286 + dayofyear);
                jy = gy - 622;
                if (leap == 0 && jd == 366)
                    return [jy, 12, 30];
                for (i = 0; jd > j_days_in_month[i]; i++) {
                    jd -= j_days_in_month[i];
                }
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

        this.handleCal = function (dt) {
            var dtmp, today, vd, newval, currentDay;
            if (dt.length !== 10) {
                dtmp = new Date();
                today = ($.mpdt.pTimestamp2Date(Math.round(dtmp.getTime() / 1000)));
//                    $(this).val(today);
                vd = $.mpdt.exploiter(today);
            } else {

                newval = $.mpdt.exploiter(' ', dt);
                if (newval.length == 1) {

                    currentDay = dt;
                } else {
                    currentDay = newval[1];
                }
                vd = $.mpdt.exploiter(currentDay);
            }

            return vd;
        }


        this.each(function () {
            $(this).addClass('mpdatepicker');

            if (settings.timePicker) {
                $(this).addClass('mptimepick');
            }


            $(this).bind('focus.open', function () {
                settings.onOpen();
                if ($(this).val() === '') {
                    $(this).attr('data-timestamp', 'null');
                }
                $(settings.mainContentId).fadeIn(400).css('display', 'flex');
                var dt = $.trim($(this).val());

                var vd = $.mpdt.handleCal(dt);

                if ($(this).attr('data-timestamp') === undefined) {
                    $(this).attr('data-timestamp', $.mpdt.pDate2Timestamp(vd[0] + '/' + vd[1] + '/' + vd[2]));
                }
                if ($(this).hasClass('mptimepick')) {
                    $(".mptimepicker").show();
                } else {
                    $(".mptimepicker").hide();
                }

                $.mpdt.ShowMonth(vd[1], vd[0], $(this).val());
                $.mpdt.selectedDate = $(this).val();
                $.mpdt.targetPicker = $(this);
                if (settings.timePicker) {
                    $('#mp-h-' + $("#mp-hour").val()).addClass('active');
                    $('#mp-m-' + $("#mp-min").val()).addClass('active');
                    $('#mp-s-' + $("#mp-sec").val()).addClass('active');
                }


            });


            $.mpdt.MakeModalBg();

            $.mpdt.WriteCSS();


        });

        this.attachCal = function (elementId) {
            var element = $('#mpdatepicker-block').detach();
            $(elementId).append(element);
            var vd = $.mpdt.handleCal('');
            $('#mpdatepicker-block').addClass('static');
            $(".mptimepicker, .mp-clear, .mp-close, .mp-today").remove();

            $.mpdt.ShowMonth(vd[1], vd[0], '');
            $.mpdt.selectedDate = '';
        }

        return this;

    };

}(jQuery));

