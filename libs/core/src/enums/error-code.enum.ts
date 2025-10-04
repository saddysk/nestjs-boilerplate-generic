/**
 * For crypto error we will reuse some fiat errors codes that we can corelate for easy to understand.
 * Did not copy all error codes from If you do not find the meaningful error code,
 * check https://stripe.com/docs/error-codes and see if any missing error code from stripe can be added
 * instead of creating your own
 */
export enum ErrorCode {
  /**
   * The customer’s bank account has been closed.
   */
  AccountClosed = 'account_closed',

  /**
   * Some account information mismatches with one another.
   * For example, some banks might require that the business_profile.name
   * must match the account holder name.
   */
  AccountInformationMismatch = 'account_information_mismatch',

  /**
   * The account ID provided as a value for the Stripe-Account header is invalid. Check that your requests are specifying a valid account ID.
   */

  AccountInvalid = 'account_invalid',

  /**
   * The bank account number provided is invalid (e.g., missing digits). Bank account information varies from country to country.
   * We recommend creating validations in your entry forms based on the bank account formats we provide.
   */
  AccountNumberInvalid = 'account_number_invalid',

  /**
   * The specified amount is greater than the maximum amount allowed. Use a lower amount and try again.
   */
  AmountTooLarge = 'amount_too_large',

  /**
   * The specified amount is less than the minimum amount allowed. Use a higher amount and try again.
   */
  AmountTooSmall = 'amount_too_small',

  /**
   * The API key provided has expired. Obtain your current API keys from the Dashboard and update your integration to use them.
   */
  ApiKeyExpired = 'api_key_expired',

  /**
   * The payment requires authentication to proceed. If your customer is off session, notify your customer to return to your
   * application and complete the payment. If you provided the error_on_requires_action parameter, then your customer
   * should try another card that does not require authentication.
   */
  AuthenticationRequired = 'authentication_required',

  /**
   * The transfer or payout could not be completed because the associated account does not have a sufficient balance available.
   * Create a new transfer or payout using an amount less than or equal to the account’s available balance.
   */
  BalanceInsufficient = 'balance_insufficient',

  /**
   * The bank account is known to not support the currency in question.
   */
  AccountBadRoutingNumbers = 'account_bad_routing_numbers',

  /**
   * The bank account provided can not be used to charge, either because it is not verified yet or it is not supported.
   */
  AccountDeclined = 'account_declined',

  /**
   * The bank account provided already exists on the specified Customer object. If the bank account should also be
   * attached to a different customer, include the correct customer ID when making the request again.
   */
  AccountExists = 'account_exists',

  /**
   * The customer’s account cannot be used with the payment method.
   */
  AccountRestricted = 'account_restricted',

  /**
   * The bank account provided cannot be used. A different bank account must be used.
   */
  AccountUnusable = 'account_unusable',

  /**
   * Your Connect platform is attempting to share an unverified bank account with a connected account.
   */
  AccountUnverified = 'account_unverified',

  // /**
  //  * The bank account cannot be verified, either because the microd-eposit amounts provided
  //  * do not match the actual amounts, or because verification has failed too many times.
  //  */
  // AccountVerificationFailed = 'account_verification_failed',

  /**
   * The Subscription or Invoice attempted payment on a PaymentMethod without an active mandate.
   * In order to create Subscription or Invoice payments with this PaymentMethod,
   * it must be confirmed on-session with a PaymentIntent or SetupIntent first.
   */
  BillingInvalidMandate = 'billing_invalid_mandate',

  // /**
  //  * This method for creating Bitcoin payments is not supported anymore. Please upgrade your integration to use Sources instead.
  //  */
  // UpgradeRequired = 'upgrade_required',

  /**
   * The charge cannot be captured as the authorization has expired. Refer to the payment method’s documentation to learn more.
   */
  CaptureChargeAuthorizationExpired = 'capture_charge_authorization_expired',

  /**
   * The charge you’re attempting to capture has not been authorized for capturing payment.
   */
  CaptureUnauthorizedPayment = 'capture_unauthorized_payment',

  // /**
  //  * This card has been declined too many times. You can try to charge this card again after 24 hours.
  //  * We suggest reaching out to your customer to make sure they have entered all of their information correctly and that there are no issues with their card.
  //  */
  // CardDeclineRateLimitExceeded = 'card_decline_rate_limit_exceeded',

  // /**
  //  * The card has been declined. When a card is declined, the error returned also includes the decline_code attribute with
  //  * the reason why the card was declined. Refer to our decline codes documentation to learn more.
  //  */
  // CardDeclined = 'card_declined',

  // /**
  //  * You must have a phone_number on file for Issuing Cardholders who will be creating EU cards.
  //  * You cannot create EU cards without a phone_number on file for the cardholder.
  //  * See the 3D Secure Documentation for more details.
  //  */
  // CardholderPhoneNumberRequired = 'cardholder_phone_number_required',

  /**
   * The charge you’re attempting to capture has already been captured. Update the request with an un-captured charge ID.
   */
  ChargeAlreadyCaptured = 'charge_already_captured',

  /**
   * The charge you’re attempting to refund has already been refunded. Update the request to use the ID of a charge that has not been refunded.
   */
  ChargeAlreadyRefunded = 'charge_already_refunded',

  /**
   * The charge you’re attempting to refund has been charged back. Check the disputes documentation to learn how to respond to the dispute.
   */
  ChargeDisputed = 'charge_disputed',

  /**
   * This charge would cause you to exceed your rolling-window processing limit for this source type.
   * Please retry the charge later, or contact us to request a higher processing limit.
   */
  ChargeExceedsSourceLimit = 'charge_exceeds_source_limit',

  /**
   * The charge cannot be captured as the authorization has expired. Auth and capture charges must be captured within a set number of days (7 by default).
   */
  ChargeExpiredForCapture = 'charge_expired_for_capture',

  /**
   * One or more provided parameters was not allowed for the given operation on the Charge. Check our API reference or the returned error message to see which values were not correct for that Charge.
   */
  ChargeInvalidParameter = 'charge_invalid_parameter',

  /**
   * Attempt to refund a charge was unsuccessful because the charge is no longer refundable.
   */
  ChargeNotRefundable = 'charge_not_refundable',

  /**
   * The clearing code provided is not supported.
   */
  ClearingCodeUnsupported = 'clearing_code_unsupported',

  /**
   * The country code provided was invalid.
   */
  CountryCodeInvalid = 'country_code_invalid',

  /**
   * Your platform attempted to create a custom account in a country that is not yet supported. Make sure that users can only sign up in countries supported by custom accounts.
   */
  CountryUnsupported = 'country_unsupported',

  /**
   * The coupon provided for a subscription or order has expired. Either create a new coupon, or use an existing one that is valid.
   */
  CouponExpired = 'coupon_expired',

  /**
   * The maximum number of PaymentMethods for this Customer has been reached. Either detach some PaymentMethods from this Customer or proceed with a different Customer.
   */
  CustomerMaxPaymentMethods = 'customer_max_payment_methods',

  /**
   * The maximum number of subscriptions for a customer has been reached. Contact us if you are receiving this error.
   */
  CustomerMaxSubscriptions = 'customer_max_subscriptions',

  /**
   * The customer has notified their bank that this payment was unauthorized.
   */
  DebitNotAuthorized = 'debit_not_authorized',

  /**
   * The email address is invalid (e.g., not properly formatted). Check that the email address is properly formatted and only includes allowed characters.
   */
  EmailInvalid = 'email_invalid',

  /**
   * The card has expired. Check the expiration date or use a different card.
   */
  ExpiredCard = 'expired_card',

  /**
   * The idempotency key provided is currently being used in another request. This occurs if your integration is making duplicate requests simultaneously.
   */
  IdempotencyKeyInUse = 'idempotency_key_in_use',

  /**
   * The card’s address is incorrect. Check the card’s address or use a different card.
   */
  IncorrectAddress = 'incorrect_address',

  // TODO: to be read

  // /**
  //  * The card’s security code is incorrect. Check the card’s security code or use a different card.
  //  */
  // IncorrectCvc = 'incorrect_cvc',

  /**
   * The card number is incorrect. Check the card’s number or use a different card.
   */
  IncorrectNumber = 'incorrect_number',

  // /**
  //  * The card’s postal code is incorrect. Check the card’s postal code or use a different card.
  //  */
  // IncorrectZip = 'incorrect_zip',

  // /**
  //  * This connected account is not eligible for Instant Payouts. Ask the platform to enable Instant Payouts.
  //  */
  // InstantPayoutsConfigDisabled = 'instant_payouts_config_disabled',

  // /**
  //  * This connected account is not eligible for Instant Payouts in this currency. Ask the platform to enable Instant Payouts in this currency.
  //  */
  // InstantPayoutsCurrencyDisabled = 'instant_payouts_currency_disabled',

  // /**
  //  * You have reached your daily processing limits for Instant Payouts.
  //  */
  // InstantPayoutsLimitExceeded = 'instant_payouts_limit_exceeded',

  // /**
  //  * This card is not eligible for Instant Payouts. Try a debit card from a supported bank.
  //  */
  // InstantPayoutsUnsupported = 'instant_payouts_unsupported',

  /**
   * The customer’s account has insufficient funds to cover this payment.
   */
  InsufficientFunds = 'insufficient_funds',

  /**
   * Intent is not in the state that is required to perform the operation.
   */
  IntentInvalidState = 'intent_invalid_state',

  /**
   * Intent does not have verification method specified in its PaymentMethodOptions object.
   */
  IntentVerificationMethodMissing = 'intent_verification_method_missing',

  // /**
  //  * The card provided as an external account is not supported for payouts. Provide a non-prepaid debit card instead.
  //  */
  // InvalidCardType = 'invalid_card_type',

  /**
   * This value provided to the field contains characters that are unsupported by the field.
   */
  InvalidCharacters = 'invalid_characters',

  /**
   * The specified amount is invalid. The charge amount must be a positive integer in the smallest currency unit,
   * and not exceed the minimum or maximum amount.
   */
  InvalidChargeAmount = 'invalid_charge_amount',

  // /**
  //  * The card’s security code is invalid. Check the card’s security code or use a different card.
  //  */
  // InvalidCvc = 'invalid_cvc',

  // /**
  //  *The card’s expiration month is incorrect. Check the expiration date or use a different card.
  //  */
  // InvalidExpiryMonth = 'invalid_expiry_month',

  // /**
  //  * The card’s expiration year is incorrect. Check the expiration date or use a different card.
  //  */
  // InvalidExpiryYear = 'invalid_expiry_year',

  // /**
  //  * The card number is invalid. Check the card details or use a different card.
  //  */
  // InvalidNumber = 'invalid_number',

  /**
   * The source cannot be used because it is not in the correct state (e.g., a charge request is trying to use a source with a pending,
   * failed, or consumed source). Check the status of the source you are attempting to use.
   */
  InvalidSourceUsage = 'invalid_source_usage',

  /**
   * An invoice cannot be generated for the specified customer as there are no pending invoice items. Check that the
   * correct customer is being specified or create any necessary invoice items first.
   */
  InvoiceNoCustomerLineItems = 'invoice_no_customer_line_items',

  /**
   * An invoice cannot be finalized because there are no payment method types available to process the payment. Your invoice template settings or
   * the invoice’s payment_settings might be restricting which payment methods are available, or you might need to activate more payment methods in the Dashboard.
   */
  InvoiceNoPaymentMethodTypes = 'invoice_no_payment_method_types',

  /**
   * An invoice cannot be generated for the specified subscription as there are no pending invoice items. Check that the
   * correct subscription is being specified or create any necessary invoice items first.
   */
  InvoiceNoSubscriptionLineItems = 'invoice_no_subscription_line_items',

  /**
   * The specified invoice can no longer be edited. Instead, consider creating additional invoice items that will be applied to the next invoice.
   * You can either manually generate the next invoice or wait for it to be automatically generated at the end of the billing cycle.
   */
  InvoiceNotEditable = 'invoice_not_editable',

  /**
   * You cannot update the on_behalf_of property of an invoice after the invoice has been assigned a number.
   */
  InvoiceOnBehalfOfNotEditable = 'invoice_on_behalf_of_not_editable',

  /**
   * This payment requires additional user action before it can be completed successfully. Payment can be completed using the PaymentIntent associated with the invoice. See this page for more details.
   */
  InvoicePaymentIntentRequiresAction = 'invoice_payment_intent_requires_action',

  /**
   * There is no upcoming invoice on the specified customer to preview. Only customers with active subscriptions or pending invoice items have invoices that can be previewed.
   */
  InvoiceUpcomingNone = 'invoice_upcoming_none',

  /**
   * Test and live mode API keys, requests, and objects are only available within the mode they are in.
   */
  LivemodeMismatch = 'livemode_mismatch',

  /**
   * This object cannot be accessed right now because another API request or Stripe process is currently accessing it.
   * If you see this error intermittently, retry the request. If you see this error frequently and are
   * making multiple concurrent requests to a single object, make your requests serially or at a lower rate. See the rate limit documentation for more details.
   */
  LockTimeout = 'lock_timeout',

  /**
   * Both a customer and source ID have been provided, but the source has not been saved to the customer. T
   * o create a charge for a customer with a specified source, you must first save the card details.
   */
  Missing = 'missing',

  /**
   * The bank account could not be located.
   */
  NoAccount = 'no_account',

  // /**
  //  * Transfers and payouts on behalf of a Standard connected account are not allowed.
  //  */
  // NotAllowedOnStandardAccount = 'not_allowed_on_standard_account',

  // /**
  //  * One or more line item(s) are out of stock. If more stock is available, update the inventory’s orderable quantity and try again.
  //  */
  // OutOfInventory = 'out_of_inventory',

  // /**
  //  * Company ownership declaration is allowed only during account updates and accounts created via account tokens.
  //  */
  // OwnershipDeclarationNotAllowed = 'ownership_declaration_not_allowed',

  /**
   * One or more required values were not provided. Make sure requests include all required parameters.
   */
  ParameterInvalidEmpty = 'parameter_invalid_empty',

  /**
   * One or more of the parameters requires an integer, but the values provided were a different type.
   * Make sure that only supported values are provided for each attribute.
   * Refer to our API documentation to look up the type of data each attribute supports.
   */
  ParameterInvalidInteger = 'parameter_invalid_integer',

  /**
   * One or more values provided only included whitespace. Check the values in your request and update any that contain only whitespace.
   */
  ParameterInvalidStringBlank = 'parameter_invalid_string_blank',

  /**
   * One or more required string values is empty. Make sure that string values contain at least one character.
   */
  ParameterInvalidStringEmpty = 'parameter_invalid_string_empty',

  /**
   * One or more required values are missing. Check our API documentation to see which values are required to create or modify the specified resource.
   */
  ParameterMissing = 'parameter_missing',

  /**
   * The request contains one or more unexpected parameters. Remove these and try again.
   */
  ParameterUnknown = 'parameter_unknown',

  /**
   * Two or more mutually exclusive parameters were provided. Check our API documentation or
   * the returned error message to see which values are permitted when creating or modifying the specified resource.
   */
  ParametersExclusive = 'parameters_exclusive',

  /**
   * The provided payment method requires customer actions to complete, but error_on_requires_action was set.
   * If you’d like to add this payment method to your integration,
   * we recommend that you first upgrade your integration to handle actions.
   */
  PaymentIntentActionRequired = 'payment_intent_action_required',

  /**
   * The provided payment method has failed authentication. Provide a new payment method to attempt to fulfill this PaymentIntent again.
   */
  PaymentIntentAuthenticationFailure = 'payment_intent_authentication_failure',

  /**
   * The PaymentIntent expected a payment method with different properties than what was provided.
   */
  PaymentIntentIncompatiblePaymentMethod = 'payment_intent_incompatible_payment_method',

  /**
   * One or more provided parameters was not allowed for the given operation on the PaymentIntent. Check our API reference or the returned error message to see which values were not correct for that PaymentIntent.
   */
  PaymentIntentInvalidParameter = 'payment_intent_invalid_parameter',

  // /**
  //  * The confirmation_number provided in payment_method_options[konbini] was rejected by the processing partner at time of PaymentIntent confirmation.
  //  */
  // PaymentIntentKonbiniRejectedConfirmationNumber = 'payment_intent_konbini_rejected_confirmation_number',

  /**
   * The provided mandate is invalid and can not be used for the payment intent.
   */
  PaymentIntentMandateInvalid = 'payment_intent_mandate_invalid',

  /**
   * The latest payment attempt for the PaymentIntent has expired.
   * Check the last_payment_error property on the PaymentIntent for more details,
   * and provide a new payment method to attempt to fulfill this PaymentIntent again.
   */
  PaymentIntentPaymentAttemptExpired = 'payment_intent_payment_attempt_expired',

  /**
   * The latest payment attempt for the PaymentIntent has failed.
   * Check the last_payment_error property on the PaymentIntent for more details,
   * and provide a new payment method to attempt to fulfill this PaymentIntent again.
   */
  PaymentIntentPaymentAttemptFailed = 'payment_intent_payment_attempt_failed',

  /**
   * The PaymentIntent’s state was incompatible with the operation you were trying to perform.
   */
  PaymentIntentUnexpectedState = 'payment_intent_unexpected_state',

  // /**
  //  * This bank account has already been verified.
  //  */
  // PaymentMethodBankAccountAlreadyVerified = 'payment_method_bank_account_already_verified',

  // /**
  //  * This bank account has failed verification in the past and can not be used. Contact us if you wish to attempt to use these bank account credentials.
  //  */
  // PaymentMethodBankAccountBlocked = 'payment_method_bank_account_blocked',

  /**
   * The PaymentMethod’s billing details is missing address details. Please update the missing fields and try again.
   */
  PaymentMethodBillingDetailsAddressMissing = 'payment_method_billing_details_address_missing',

  /**
   * Attempt to create or modify Payment Method Configuration was unsuccessful.
   */
  PaymentMethodConfigurationFailures = 'payment_method_configuration_failures',

  /**
   * The currency specified does not match the currency for the attached payment method. A payment can only be created for the same currency as the corresponding payment method.
   */
  PaymentMethodCurrencyMismatch = 'payment_method_currency_mismatch',

  /**
   * The customer did not approve the payment. Please provide a new payment method to attempt to fulfill this intent again.
   */
  PaymentMethodCustomerDecline = 'payment_method_customer_decline',

  /**
   * Invalid parameter was provided in the payment method object. Check our API documentation or the returned error message for more context.
   */
  PaymentMethodInvalidParameter = 'payment_method_invalid_parameter',

  /**
   * The parameter provided for payment method is not allowed to be used in testmode. Check our API documentation or the returned error message for more context.
   */
  PaymentMethodInvalidParameterTestmode = 'payment_method_invalid_parameter_testmode',

  // /**
  //  * Micro-deposits were failed to be deposited into the customer’s bank account. Please check the account, institution and transit numbers as well as the currency type.
  //  */
  // PaymentMethodMicrodepositFailed = 'payment_method_microdeposit_failed',

  // /**
  //  * You must provide exactly two microdeposit amounts.
  //  */
  // PaymentMethodMicrodepositVerificationAmountsInvalid = 'payment_method_microdeposit_verification_amounts_invalid',

  // /**
  //  * The amounts provided do not match the amounts that were sent to the bank account.
  //  */
  // PaymentMethodMicrodepositVerificationAmountsMismatch = 'payment_method_microdeposit_verification_amounts_mismatch',

  // /**
  //  * You have exceeded the number of allowed verification attempts.
  //  */
  // PaymentMethodMicrodepositVerificationAttemptsExceeded = 'payment_method_microdeposit_verification_attempts_exceeded',

  // /**
  //  * The verification code provided does not match the one sent to the bank account.
  //  */
  // PaymentMethodMicrodepositVerificationDescriptorCodeMismatch = 'payment_method_microdeposit_verification_descriptor_code_mismatch',

  // /**
  //  * Payment method should be verified with microdeposits within the required period.
  //  */
  // PaymentMethodMicrodepositVerificationTimeout = 'payment_method_microdeposit_verification_timeout',

  /**
   * The payment processor for the provided payment method is temporarily unavailable.
   * Please try a different payment method or retry later with the same payment method.
   */
  PaymentMethodNotAvailable = 'payment_method_not_available',

  /**
   * The payment or setup attempt was declined by the issuer or customer.
   * Check the last_payment_error or last_setup_error property on the PaymentIntent or
   * SetupIntent respectively for more details, and provide a new payment method to attempt to fulfill this intent again.
   */
  PaymentMethodProviderDecline = 'payment_method_provider_decline',

  /**
   * The payment method failed due to a timeout. Check the last_payment_error or last_setup_error
   * property on the PaymentIntent or SetupIntent respectively for more details,
   * and provide a new payment method to attempt to fulfill this intent again.
   */
  PaymentMethodProviderTimeout = 'payment_method_provider_timeout',

  /**
   * The operation cannot be performed as the payment method used has not been activated. Activate the payment method in the Dashboard, then try again.
   */
  PaymentMethodUnactivated = 'payment_method_unactivated',

  /**
   * The provided payment method’s state was incompatible with the operation you were trying to perform.
   * Confirm that the payment method is in an allowed state for the given operation before attempting to perform it.
   */
  PaymentMethodUnexpectedState = 'payment_method_unexpected_state',

  /**
   * The API only supports payment methods of certain types.
   */
  PaymentMethodUnsupportedType = 'payment_method_unsupported_type',

  /**
   * Reconciliation for this payout is still in progress.
   */
  PayoutReconciliationNotReady = 'payout_reconciliation_not_ready',

  /**
   * You have reached your daily processing limits for this payout type.
   */
  PayoutsLimitExceeded = 'payouts_limit_exceeded',

  /**
   * Payouts have been disabled on the connected account. Check the connected account’s status to see if any additional information needs to be provided, or if payouts have been disabled for another reason.
   */
  PayoutsNotAllowed = 'payouts_not_allowed',

  // /**
  //  * Only Stripe Connect platforms can work with other accounts. If you need to setup a Stripe Connect platform, you can do so in the dashboard.
  //  */
  // PlatformAccountRequired = 'platform_account_required',

  // /**
  //  * The API key provided by your Connect platform has expired. This occurs if your platform has either generated a new key or the connected account has been disconnected from the platform. Obtain your current API keys from the Dashboard and update your integration, or reach out to the user and reconnect the account.
  //  */
  // PlatformApiKeyExpired = 'platform_api_key_expired',

  /**
   * The postal code provided was incorrect.
   */
  PostalCodeInvalid = 'postal_code_invalid',

  /**
   * An error occurred while processing the card. Try again later or with a different payment method.
   */
  ProcessingError = 'processing_error',

  /**
   * The product this SKU belongs to is no longer available for purchase.
   */
  ProductInactive = 'product_inactive',

  /**
   * Progressive onboarding limit has been reached for the platform.
   */
  ProgressiveOnboardingLimitExceeded = 'progressive_onboarding_limit_exceeded',

  /**
   * Too many requests hit the API too quickly. We recommend an exponential backoff of your requests.
   */
  RateLimit = 'rate_limit',

  /**
   * The customer has stopped the payment with their bank. Contact them for details and to arrange payment.
   */
  ReferToCustomer = 'refer_to_customer',

  /**
   * You cannot refund a disputed payment.
   */
  RefundDisputedPayment = 'refund_disputed_payment',

  /**
   * A resource with a user-specified ID (e.g., plan or coupon) already exists. Use a different, unique value for id and try again.
   */
  ResourceAlreadyExists = 'resource_already_exists',

  /**
   * The ID provided is not valid. Either the resource does not exist, or an ID for a different resource has been provided.
   */
  ResourceMissing = 'resource_missing',

  /**
   * You cannot confirm this refund as it is already processed.
   */
  ReturnIntentAlreadyProcessed = 'return_intent_already_processed',

  /**
   * The bank routing number provided is invalid.
   */
  RoutingNumberInvalid = 'routing_number_invalid',

  /**
   * The API key provided is a publishable key, but a secret key is required. Obtain your current API keys from the Dashboard and update your integration to use them.
   */
  SecretKeyRequired = 'secret_key_required',

  // /**
  //  * Your account does not support SEPA payments.
  //  */
  // SepaUnsupportedAccount = 'sepa_unsupported_account',

  /**
   * The latest setup attempt for the SetupIntent has failed. Check the last_setup_error property on the SetupIntent for more details, and provide a new payment method to attempt to set it up again.
   */
  SetupAttemptFailed = 'setup_attempt_failed',

  /**
   * The provided payment method has failed authentication. Provide a new payment method to attempt to fulfill this SetupIntent again.
   */
  SetupIntentAuthenticationFailure = 'setup_intent_authentication_failure',

  /**
   * One or more provided parameters was not allowed for the given operation on the SetupIntent. Check our API reference or the returned error message to see which values were not correct for that SetupIntent.
   */
  SetupIntentInvalidParameter = 'setup_intent_invalid_parameter',

  /**
   * The provided mandate is invalid and can not be used for the setup intent.
   */
  SetupIntentMandateInvalid = 'setup_intent_mandate_invalid',

  /**
   * The latest setup attempt for the SetupIntent has expired. Check the last_setup_error property on the SetupIntent for more details, and provide a new payment method to attempt to complete this SetupIntent again.
   */
  SetupIntentSetupAttemptExpired = 'setup_intent_setup_attempt_expired',

  /**
   * The SetupIntent’s state was incompatible with the operation you were trying to perform.
   */
  SetupIntentUnexpectedState = 'setup_intent_unexpected_state',

  /**
   * Shipping calculation failed as the information provided was either incorrect or could not be verified.
   */
  ShippingCalculationFailed = 'shipping_calculation_failed',

  /**
   * The SKU is inactive and no longer available for purchase. Use a different SKU, or make the current SKU active again.
   */
  SkuInactive = 'sku_inactive',

  // /**
  //  * Occurs when providing the legal_entity information for a U.S. custom account, if the provided state is not supported. (This is mostly associated states and territories.)
  //  */
  // StateUnsupported = 'state_unsupported',

  /**
   * The requested status transition is not valid.
   */
  StatusTransitionInvalid = 'status_transition_invalid',

  /**
   * The tax ID number provided is invalid (e.g., missing digits). Tax ID information varies from country to country, but must be at least nine digits.
   */
  TaxIdInvalid = 'tax_id_invalid',

  /**
   * Tax calculation for the order failed.
   */
  TaxesCalculationFailed = 'taxes_calculation_failed',

  // /**
  //  * Terminal is currently only available in some countries. Locations in your country cannot be created in livemode.
  //  */
  // TerminalLocationCountryUnsupported = 'terminal_location_country_unsupported',

  // /**
  //  * Reader is currently busy processing another request. Please reference the integration guide for details on how to handle this error.
  //  */
  // TerminalReaderBusy = 'terminal_reader_busy',

  // /**
  //  * Reader is currently offline, please ensure the reader is powered on and connected to the internet before retrying your request. Reference the integration guide for details on how to handle this error.
  //  */
  // TerminalReaderOffline = 'terminal_reader_offline',

  // /**
  //  * There was a timeout when sending this command to the reader. Please reference the integration guide for details on how to handle this error.
  //  */
  // TerminalReaderTimeout = 'terminal_reader_timeout',

  /**
   * Your account has not been activated and can only make test charges. Activate your account in the Dashboard to begin processing live charges.
   */
  TestmodeChargesOnly = 'testmode_charges_only',

  /**
   * Your integration is using an older version of TLS that is unsupported. You must be using TLS 1.2 or above.
   */
  TlsVersionUnsupported = 'tls_version_unsupported',

  /**
   * The token provided has already been used. You must create a new token before you can retry this request.
   */
  TokenAlreadyUsed = 'token_already_used',

  /**
   * The token provided is currently being used in another request. This occurs if your integration is making duplicate requests simultaneously.
   */
  TokenInUse = 'token_in_use',

  /**
   * When creating a Transfer, the payments parameter in source_balance should not be passed in when balance type is set to issuing.
   */
  TransferSourceBalanceParametersMismatch = 'transfer_source_balance_parameters_mismatch',

  /**
   * The requested transfer cannot be created. Contact us if you are receiving this error.
   */
  TransfersNotAllowed = 'transfers_not_allowed',

  /**
   * The URL provided is invalid.
   */
  UrlInvalid = 'url_invalid',
}
