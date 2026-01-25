---
theme: beryl
---

# Form Fields

mdforge supports interactive form fields for creating fillable PDF documents.

## Text Inputs

Basic text input with a label:

[Full Name ??](fullName)

Text input marked as required (asterisk modifier):

[Email ??*](email)

Text input without a label:

[??](anonymous)

## Textarea

Use three question marks for multi-line text areas:

[Comments ???](comments)

## Select Dropdown

Create a dropdown by following the field declaration with a list:

[?select? Country](country)
- United States
- Canada
- United Kingdom
- Australia
- Other

## Radio Buttons

Radio buttons work the same way, using `?radiolist?`:

[?radiolist? Payment Method](payment)
- Credit Card
- PayPal
- Bank Transfer

## Checkboxes

Checkboxes allow multiple selections:

[?checklist? Interests](interests)
- Technology
- Design
- Business
- Marketing

## Custom Values

List items can have display text and a separate value:

[?select? Size](size)
- Small "S"
- Medium "M"
- Large "L"
- Extra Large "XL"

## Practical Example: Registration Form

### Personal Information

[First Name ??*](firstName)

[Last Name ??*](lastName)

[Email Address ??*](emailAddress)

[Phone ??](phone)

### Preferences

[?radiolist? Contact Preference](contactPref)
- Email
- Phone
- No contact

[?checklist? Newsletter Topics](topics)
- Product Updates
- Tips & Tutorials
- Company News

### Additional Notes

[Any questions or comments? ???](notes)
