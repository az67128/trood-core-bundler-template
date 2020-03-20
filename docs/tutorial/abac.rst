=================================
ABAC Access rights configuration
=================================

.. _`Custodian ABAC documentation`: /troodcore/custodian/abac.html

*****************************
Business object access rules
*****************************

For configuring access rights to Business Object read `Custodian ABAC documentation`_

*****************************
FRONTEND domain access rules
*****************************

Configuration of access rules for FRONTEND is similar to configuration of CUSTODIAN

Your can configure access to system pages

1. Add domain FRONTEND (if not exist)

2. Add resource to domain FRONTEND.

    As a resource you should use page id.

    Id generate from page url and BOName. In example BOName = client

    .. list-table::
        :header-rows: 1

        * - link
          - pattern
          - example
        * - /clients
          - <UrlPath[0]>_PAGE
          - CLIENTS_PAGE
        * - /clients/management
          - <UrlPath[0]>_<UrlPath[1]>_PAGE
          - CLIENTS_MANAGEMENT_PAGE
        * - /clients/<PK>
          - <UrlPath[0]>_<BOName>_PAGE

            *its id for all clients entity page, not for a specific object*
          - CLIENTS_CLIENT_PAGE
        * - /clients/<PK>/general-info
          - <UrlPath[0]>_<BOName>_<UrlPath[2]>_<BOName>_PAGE

            *its id for all clients entity page, not for a specific object*
          - CLIENTS_CLIENT_GENERAL-INFO_CLIENT_PAGE

3. Add action `view` to your resource

4. Add rules.

    **sbj** rules is same as CUSTODIAN

    **obj** rules not exist in FRONTEND domain

    **ctx** rules is specify in FRONTEND domain. ctx contains:

        * ctx.media.mobile: <bool> - screen width < 1024
        * ctx.media.tablet: <bool> - screen width >= 1024 && < 1280
        * ctx.media.portable: <bool> - screen width < 1280
        * ctx.media.desktopSmall: <bool> - screen width >= 1280 && <= 1400
        * ctx.media.desktopLarge: <bool> - screen width > 1400
        * ctx.media.desktop: <bool> - screen width >= 1280
