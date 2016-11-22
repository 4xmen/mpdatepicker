;(function ($) {

    $.fn.mpdatepicker = function ( options ) {

        $.mpdt = this;

        var settings = $.extend({
            text: 'Hello, World!',
            color: null,
            fontStyle: null,
            complete: null
        }, options);


        this.persian_month_names = ['', 'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];


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


        this.exploiter = function (date_txt, determ) {
            if (determ === undefined) {
                determ = '/';
            }
            var a = date_txt.split(determ);
            
            if (a[0].length < a[2].length) {
                return [a[2],a[1],a[0]] ;
            }
            
            return a;
        };
        this.imploiter = function (date_txt, determ) {
            if (determ === undefined) {
                determ = '/';
            }
           
            return date_txt[2] +determ+date_txt[1] +determ+date_txt[2] ;
        };


        /**
         * from parsi date by mobin ghasem pour 
         * @param {Array} indate
         * @returns {Array}
         */
        this.Persian2Gregorian = function (indate) {
            var jy = indate[0];
            var jm= indate[1];
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
        this.Gregorian2Persian = function (indate ) {
            
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


            console.log($.mpdt.Gregorian2Persian($.mpdt.exploiter($(this).val())));
        });


    };

}(jQuery));

