(function( $ ) {
	var methods = {
		init : function() {},
		isEmail : function( text ) {
			regex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,5})?$/;
			return regex.test(text);
		},
		isAlpha : function( text ) {
			regex = /^[A-Za-z]*$/;
			return regex.test(text);
		},
		isAlphaNum : function( text ) {
			regex = /^[A-Za-z0-9]*$/;
			return regex.test(text);
		},
		isNumeric : function( text ) {
			regex = /^[0-9]*$/;
			return regex.test(text);
		},
		isPhone : function( text ) {
			regex = /^[\+]?[\s\d]+$/;
			return regex.test(text);
		},
		isInteger : function( value ) {
			return ((value - 0) == value && value % 1 == 0);
		},
		isUrl : function( text ) {
			regex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
			return regex.test(text);
		},
		isIp : function( text ) {
			regex = /^\b(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b$/;
			return regex.test(text);
		},
		isDate : function( dateStr ) {
			var datePat = /^(\d{1,2})(\/|-)(\d{1,2})(\/|-)(\d{4})$/;
			var matchArray = dateStr.match(datePat);
			if( !datePat.test(dateStr) )
				return false;

			month = matchArray[1];
			day = matchArray[3];
			year = matchArray[5];
			if( month < 1 || month > 12 )
				return false;
			if( day < 1 || day > 31 )
				return false;
			if( (month==4 || month==6 || month==9 || month==11) && day==31 )
				return false;

			if( month == 2 ) { // check for february 29th
				var isleap = (year % 4 == 0 && (year % 100 != 0 || year % 400 == 0));
				if( day > 29 || (day==29 && !isleap) )
					return false;
			}
			return true; // date is valid
		},
	};

	$.fn.validate = function( options ) {
		var defaults = {
			opt: "",
		};
		var options = $.extend(defaults, options);
		var form = this;
		
		return $(form.selector).submit(function(ev) {
			var warning = '';
			$(form.selector).find('input, select, textarea').each(function() {
				var data_rules = $(this).data('rules');
				if( data_rules != '' && data_rules != undefined ) {
					var validation = data_rules.split('#');
					for( var x=0; x<validation.length; x++ ) {
						var rule = validation[x].split('-');
							var label = rule[0];
							var type = rule[1];
							var value = $(this).val();

						if( type == 'required' && value == '' ) {
							warning += 'The ' + label + ' field is required.\n';
						}

						if( type == 'valid_email' && !methods.isEmail(value) ) {
							warning += 'The ' + label + ' field must contain a valid email address.\n';
						}

						if( type == 'valid_url' && value != '' && !methods.isUrl(value) ) {
							warning += 'The ' + label + ' field must contain a valid URL.\n';
						}

						if( type == 'valid_ip' && value != '' && !methods.isIp(value) ) {
							warning += 'The ' + label + ' field must contain a valid IP.\n';
						}

						if( type.substr(0, 10) == 'min_length' && value != '' ) {
							temp = type.split('+');
							length = temp[1];
							if( value.length < length ) {
								suffix = '';
								if( length > 1 )
									suffix = 's';
								warning += 'The ' + label + ' field must be at least ' + length + ' character' + suffix + ' in length.\n';
							}
						}

						if( type.substr(0, 10) == 'max_length' && value != '' ) {
							temp = type.split('+');
							length = temp[1];
							if( value.length > length ) {
								suffix = '';
								if( length > 1 )
									suffix = 's';
								warning += 'The ' + label + ' field can not exceed ' + length + ' character' + suffix + ' in length.\n';
							}
						}

						if( type.substr(0, 12) == 'exact_length' && value != '' ) {
							temp = type.split('+');
							length = temp[1];
							if( value.length != length ) {
								suffix = '';
								if( length > 1 )
									suffix = 's';
								warning += 'The ' + label + ' field must be exactly ' + length + ' character' + suffix + ' in length.\n';
							}
						}

						if( type.substr(0, 3) == 'min' && value != '' && methods.isInteger(value) ) {
							temp = type.split('+');
							limit = temp[1];
							if( value < limit ) {
								warning += 'The ' + label + ' field must be greater than ' + limit + '.\n';
							}
						}

						if( type.substr(0, 3) == 'max' && value != '' && methods.isInteger(value) ) {
							temp = type.split('+');
							limit = temp[1];
							if( value > limit ) {
								warning += 'The ' + label + ' field must be less than ' + limit + '.\n';
							}
						}

						if( type == 'alpha' && !methods.isAlpha(value) ) {
							warning += 'The ' + label + ' field may only contain alphabetical characters.\n';
						}

						if( type == 'alpha_numeric' && !methods.isAlphaNum(value) ) {
							warning += 'The ' + label + ' field may only contain alpha-numeric characters.\n';
						}

						if( type == 'numeric' && value != '' && parseFloat(value).toString() != value ) {
							warning += 'The ' + label + ' field must contain only numbers.\n';
						}

						if( type == 'is_numeric' && !methods.isNumeric(value) ) {
							warning += 'The ' + label + ' field must contain only numeric characters.\n';
						}

						if( type == 'integer' && value != '' && !methods.isInteger(value) ) {
							warning += 'The ' + label + ' field must contain an integer.\n';
						}

						if( type.substr(0, 7) == 'matches' && value != '' ) {
							temp = type.split('+');
							match_id = temp[1];
							match_label = temp[2];
							match_value = $('#'+match_id).val();
							if( value != match_value ) {
								warning += 'The ' + label + ' field does not match the ' + match_label + ' field.\n';
							}
						}

						if( type == 'valid_phone' && value != '' && !methods.isPhone(value) ) {
							warning += 'The ' + label + ' field must contain a valid phone number.\n';
						}

						if( type == 'valid_date' && value != '' && !methods.isDate(value) ) {
							warning += 'The ' + label + ' field must contain a valid date.\n';
						}

						if( type.substr(0, 11) == 'valid_check' ) {
							if( $(this).attr('checked') != 'checked' )
								warning += label + '\n';
						}

						if( type.substr(0, 11) == 'valid_radio' ) {
							match_class = $(this).attr('name');
							flag = 0;
							$(form.selector).find('input:radio').each(function() {
								if( $(this).attr('name') == match_class  && $(this).attr('checked') == 'checked' ) {
									flag++;
								}
							});
							if( flag == 0 )
								warning += 'Please choose one of ' + label + ' options.\n';
						}

						if( type.substr(0, 11) == 'multi_check' ) {
							temp = type.split('+');
							match_unit = temp[1];
							match_class = $(this).attr('name');
							flag = 0;
							$(form.selector).find('input:checkbox').each(function() {
								if( $(this).attr('name') == match_class  && $(this).attr('checked') == 'checked' ) {
									flag++;
								}
							});
							if( flag < match_unit )
								warning += 'Please choose (min) ' + match_unit + ' of ' + label + ' options.\n';
						}

					} //end for
				}
			});

			if( warning != '' ) {
				window.alert(warning);
				return false;
			} else {
				return true;
			}
		});
	};
})( jQuery );