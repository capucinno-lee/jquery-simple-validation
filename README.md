jQuery Simple Validation
================

A simple jquery validation plugin for validating form that fit your application easily.

## How to Use

Just include `jquery.simple.validation.js`, then select a form to validate and call the `validate()` method.

```html
<!DOCTYPE html>
<html>
<head>
    <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
    <script type="text/javascript" src="jquery.simple.validation.js"></script>
    <script type="text/javascript">
        $(document).ready(function () {
            $('.form_validation').validate();
        });
    </script>
</head>
<body>
    <form class="form_validation">
    	<!-- single rule -->
        	<input name="name" type="text" data-rules="First Name-required" />
        <!-- multi-rules -->
        	<input name="email" type="text" data-rules="Email Address-required#Email Address-valid_email" />
        <input type="submit" value="Submit" />
    </form>
</body>
</html>
```

For more information on how to setup rules and customizations, [check the documentation](http://capucinno-lee.site44.com/jquery-simple-validation/).

## Credit
Copyright &copy; 2013 capucinno-lee. Originally created in [Closely Coded](http://www.closelycoded.com/).
