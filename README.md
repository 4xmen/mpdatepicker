# mpdatepicker

Materialize Persian Date and time picker by A1Gard 4xmen.ir


## installation

+ npm:
    + `npm i mpdatepicker`
+ yarn:
    + `yarn add mpdatepicker`

## screenshot

![mp datetime picker](http://4xmen.ir/wp-content/uploads/2018/01/mpdatepicker_screenshot.png)

## How to use

Add jquery:
```html
<script type="text/javascript" src="../dist/jquery.min.js"></script>
```
Add additional font for best view:
```html
<link type="text/css" rel="stylesheet" href="http://4xmen.ir/cdn/VazirCodeX.css" /> 
```
	
Add css and jquery plugin:
```html
<script type="text/javascript" src="../dist/jquery.mpdatepicker.js"></script>
<link type="text/css" rel="stylesheet" href="../dist/jquery.mpdatepicker.css" />
```

use plugin :
```javascript
$(function () {
    $(".sample-date-picker").mpdatepicker({
        'timePicker': true
    });
});
```        
