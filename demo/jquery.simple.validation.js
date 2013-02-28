(function($, window, undefined) {
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

	$.fn.validate = function( opts ) {
		var options = $.extend({
			'short_error_message' : false,
		}, opts || {});
		var form = this;

		return $(form.selector).submit(function(ev) {
			var warning = '';
			$(form.selector).find('input, select, textarea').each(function() {

				if( $(this).is(':visible') ) {
					var data_rules = $(this).data('rules');
					if( data_rules != '' && data_rules != undefined ) {
						var validation = data_rules.split('#');
						for( var x=0; x<validation.length; x++ ) {
							var rule = validation[x].split('-');
								var label = label_ori = rule[0];
								var type = rule[1];
								var value = $(this).val();

							if( options.short_error_message == false ) {
								label = 'The ' + label + ' field';
							}

							if( type == 'required' && value == '' ) {
								warning += label + ' is required.\n';
							}

							else if( type == 'valid_email' && !methods.isEmail(value) ) {
								warning += label + ' must contain a valid email address.\n';
							}

							else if( type == 'valid_url' && value != '' && !methods.isUrl(value) ) {
								warning += label + ' must contain a valid URL.\n';
							}

							else if( type == 'valid_ip' && value != '' && !methods.isIp(value) ) {
								warning += label + ' must contain a valid IP.\n';
							}

							else if( type.substr(0, 10) == 'min_length' && value != '' ) {
								temp = type.split('+');
								length = temp[1];
								if( value.length < length ) {
									suffix = '';
									if( length > 1 )
										suffix = 's';
									warning += label + ' must be at least ' + length + ' character' + suffix + ' in length.\n';
								}
							}

							else if( type.substr(0, 10) == 'max_length' && value != '' ) {
								temp = type.split('+');
								length = temp[1];
								if( value.length > length ) {
									suffix = '';
									if( length > 1 )
										suffix = 's';
									warning += label + ' can not exceed ' + length + ' character' + suffix + ' in length.\n';
								}
							}

							else if( type.substr(0, 12) == 'exact_length' && value != '' ) {
								temp = type.split('+');
								length = temp[1];
								if( value.length != length ) {
									suffix = '';
									if( length > 1 )
										suffix = 's';
									warning += label + ' must be exactly ' + length + ' character' + suffix + ' in length.\n';
								}
							}

							else if( type.substr(0, 3) == 'min' && value != '' && methods.isInteger(value) ) {
								temp = type.split('+');
								limit = temp[1];
								if( value < limit ) {
									warning += label + ' must be greater than ' + limit + '.\n';
								}
							}

							else if( type.substr(0, 3) == 'max' && value != '' && methods.isInteger(value) ) {
								temp = type.split('+');
								limit = temp[1];
								if( value > limit ) {
									warning += label + ' must be less than ' + limit + '.\n';
								}
							}

							else if( type == 'alpha' && !methods.isAlpha(value) ) {
								warning += label + ' may only contain alphabetical characters.\n';
							}

							else if( type == 'alpha_numeric' && !methods.isAlphaNum(value) ) {
								warning += label + ' may only contain alpha-numeric characters.\n';
							}

							else if( type == 'numeric' && value != '' && parseFloat(value).toString() != value ) {
								warning += label + ' must contain only numbers.\n';
							}

							else if( type == 'is_numeric' && !methods.isNumeric(value) ) {
								warning += label + ' must contain only numeric characters.\n';
							}

							else if( type == 'integer' && value != '' && !methods.isInteger(value) ) {
								warning += label + ' must contain an integer.\n';
							}

							else if( type.substr(0, 7) == 'matches' && value != '' ) {
								temp = type.split('+');
								match_id = temp[1];
								match_label = temp[2];
								match_value = $('#'+match_id).val();
								if( options.short_error_message == false )
									match_label = 'the ' + label + ' field';
								if( value != match_value ) {
									warning += label + ' does not match with ' + match_label + '.\n';
								}
							}

							else if( type == 'valid_phone' && value != '' && !methods.isPhone(value) ) {
								warning += label + ' must contain a valid phone number.\n';
							}

							else if( type == 'valid_date' && value != '' && !methods.isDate(value) ) {
								warning += label + ' must contain a valid date.\n';
							}

							else if( type.substr(0, 11) == 'valid_check' ) {
								if( $(this).attr('checked') != 'checked' )
									warning += label_ori + '\n';
							}

							else if( type.substr(0, 11) == 'valid_radio' ) {
								match_class = $(this).attr('name');
								flag = 0;
								$(form.selector).find('input:radio').each(function() {
									if( $(this).attr('name') == match_class  && $(this).attr('checked') == 'checked' ) {
										flag++;
									}
								});
								if( flag == 0 )
									warning += 'Please choose one of ' + label_ori + ' options.\n';
							}

							else if( type.substr(0, 11) == 'multi_check' ) {
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
									warning += 'Please choose (min) ' + match_unit + ' of ' + label_ori + ' options.\n';
							}

						} //end for
					} //if set data-rules
				} //if visible
			});

			if( warning != '' ) {
				alert(warning);
				return false;
			} else {
				return true;
			}
		});
	};
})(jQuery, window);