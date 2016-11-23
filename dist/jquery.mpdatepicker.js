;
(function ($) {

    $.fn.mpdatepicker = function (options) {

        $.mpdt = this;

        var settings = $.extend({
            modal_bg: 'rgba(0,0,0,0.5)',
            datepicker_bg: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAXCAYAAAALHW+jAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4AsWCCkyWrAXowAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAAJDSURBVDjLnZU9a1RREIaf2b2ra9gFU6g5uLEwIgoBBRWsRFSiweYq/gIbQSsFDVpIQBSsxMKf4AcIcgoRRFGLIGJnExU/ihQeTSlKkt14x2YOHC53N9Epdnlnzpk795135kKFOa+XndcGfcx53ei8TjmvUo7V+ty5AWynvx0BrgKrTgjQGxBbBjTkUpQD4rx2gPdAqxQrBjxQ4/3E9x0YrwGXSsnG7f8k0K1I9ge4BvwGziT+EeB8DdhQunDY+CmANRUJ68BH4CawtxRrifM6BRyqeCVhsFWdeZQBXyr4+1+by4yrU8B8KjXgW1JB2zq7kKhjkzUiNmgzcDt2cSbk0gG2AVuAzyGX0QRfB04DW823C5gDxgyPWkGaJRIh5LJok6AlvAz0Qi5dww2rbCnkouZbUdj9tDfQJ87rXWACeG0PUOv6MyAzPAb8SnjOgAPAS4sXwDHgTmbEzwMPTHfLpq/7wDrDx4EAvLPzTWAP8DAZxYOA4Lzec16fl7bJhxK+4LxOJrjtvH6NvJnvh/N66184lNX4YpcbzusQsNa2TN15zUx/PXv1lvO63pK0je9hU0QvJs+M0N1GcGxKB5ixuVUb/EXgYjLPI8DTpNvDUYd14E3I5WjCx2zIZX+CzwKzIZdXhgX4FHLZl5wJgMSK6iss3iYwlG4VoFb6BNTij8RJGSDYLrCU4AWgiFOSbh9xXqeBc8ALq7QAJoHHQMPwDuCnLYPI/QTwJBndE8AVcV6btix3JpWWd13V7kt9ArwFpv8Ctt/A5Glz+/0AAAAASUVORK5CYII=',
            fontStyle: null,
            complete: null
        }, options);


        this.persian_month_names = ['', 'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];




        this.WriteCSS = function () {

            $("#mpdatepicker-modal").css({
                "background": settings.modal_bg
            });


            $(' <style>' +
                    '.mpdatepicker {background-image: url(' + settings.datepicker_bg + ');}' +
                    ' <style>').appendTo("head");


        }


        this.ShowMonth = function (mn, yr, pickedday) {


            var content = '<tr>';
            for (var i = 1; i <= 31; i++) {
                content = content + ('<td>' + this.parseHindi(i) + '</td>');
                if (i % 7 == 0) {
                    content = content + ('</tr></tr>');
                }
            }

            $("#mpdatepicker-block table tbody").html(content);

        }


        this.AddDatepcikerBlock = function () {
            $("#mpdatepicker-modal").append('<div id="mpdatepicker-block"><div class="mpbtn mpfleft" >&rsaquo;</div> ' +
                    ' <div class="mpbtn mpfright" >&lsaquo;</div><div class="mpheader"><div id="mpmonth"> <ul></ul> <span> اردیبهشت </span>  </div> <div id="mpyear">  <input type="number" value="1396" /> </div>   </div> ' +
                    '<table> <thead> <th> ش </th><th> ی </th><th> د </th><th> س  </th><th> چ </th><th> پ </th><th> آ</th> </thead> <tbody></tbody> </table>' +
                    '</div>');
            $(this.persian_month_names).each(function (k, v) {
                if (k !== 0) {
                    $("#mpmonth ul").append("<li data-id='" + k + "'>" + this + " </li>");
                }
            });

            $("#mpmonth ul li").bind('click.select', function () {
                var text = $.trim($(this).text());
                $("#mpmonth span").text(text);
                $("#mpmonth ul").slideUp(100);
            });


            $("#mpmonth span").bind('click.monthselect', function () {
                $("#mpmonth ul").slideDown(200);
            });

        };

        this.MakeModalBg = function () {
            // check is modal exists
            if ($("#mpdatepicker-modal").length == 0) {
                //it doesn't exist
                $('body').append('<div id="mpdatepicker-modal" ></div>');
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
            var org = ['0','1','2','3','4','5','6','7','8','9'];
            var hindi = ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'];
            for (var ch in org) {
                r = r.replace(org[ch],hindi[ch]);
            }
            
            return r ;
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

            return date_txt[2] + determ + date_txt[1] + determ + date_txt[2];
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
            return [jy, jm, jd];
        };


        this.each(function () {
            $(this).addClass('mpdatepicker');


            $(this).bind('focus.open', function () {
                $("#mpdatepicker-modal").fadeIn(400);
            });

            console.log($.mpdt.Gregorian2Persian($.mpdt.exploiter($(this).val())));


            $.mpdt.MakeModalBg();
            $.mpdt.AddDatepcikerBlock();
            $.mpdt.WriteCSS();
            $.mpdt.ShowMonth();

        });


    };

}(jQuery));

