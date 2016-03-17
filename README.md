# LazeeMenu

LazeeMenu is a Javascript plugin that turns a nested unordered list of links into a vertical multi-level
navigation menu. It is heavily inspired by the similar menu used by Github on its reference pages, but with support for more levels. It also support not having links on the expandable menu items, making it very flexible. At the moment LazeeMenu is implemented as a JQuery plugin, but a pure Javascript version will be released soon.

## Getting started

Download the plugin, unzip it and copy the files to your project folder. Then include the css and js inside your HTML.

```HTML
<head>
    <!-- Load LazeeMenu CSS -->
    <script type="text/javascript" src="/lazeemenu/lazeemenu.css"></script>
</head>
<body>
    <!-- Add this at the bottom of the body tag -->
    <!-- Load JQuery -->
    <script type="text/javascript" src="http://code.jquery.com/jquery-latest.min.js"></script>
    <!-- Load LazeeMenu -->
    <script type="text/javascript" src="/lazeemenu/lazeemenu-jquery.js"></script>
</body>
```

Sample menu and how to activate:

```HTML
<ul class="menu-1">
    <li>
    <li>
        <h3><span>Tennis</span></h3>
        <ul>
            <li><a href="/">Serves</a></li>
            <li class="active"><a href="/">Player results</a></li>
            <li><a href="/">Leagues</a></li>
            <li><a href="/">Tournaments</a></li>
        </ul>
    </li>
    <li>
        <h3><span>Ballet</span></h3>
        <ul>
            <li><a href="/">Dancers</a></li>
            <li><a href="/">Famous acts</a></li>
        </ul>
    </li>
</ul>
<script type="text/javascript">
    $(document).ready(function() {
        $('.menu-1').lazeemenu();
    });
</script>
```

There are also a few options that can be extended:

```HTML
<script type="text/javascript">
    $(document).ready(function() {
        $('.menu-1').lazeemenu({
            activeClass: 'active',
            initialState: 'default'        
        });
    });
</script>
```

## Options

These are the options you can set during activation of a menu.

### activeClass

  * **Type:** `string`
  * **Default:** `active`

The name of the class name used in *li* elements to indicate what link that should be marked as active.

### initialState

  * **Type:** `string`
  * **Default:** `default`

You can set this value to `expanded` if you initially want the entire menu expanded. Setting it to `collapsed` will collapse the menu. Finally `default` (Which is the default ;)) will make sure that the active link is expanded. Everything else will be collapsed.


## Public methods

### expandAll

Expand all menu items

```js
$(selector).lazeemenu('expandAll');
```

### expandAll

Collapse all menu items

```js
$(selector).lazeemenu('collapseAll');
```
