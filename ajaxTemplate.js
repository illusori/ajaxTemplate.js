//  Support for AJAX requests modifying the document according to
//  rules and templates defined within the document itself.
//  Purpose is to allow the structure of the document to be defined
//  in one place rather than building entirely in javascript via the DOM
//  (a pain for non-developer designers) or having it partly in the document
//  as XHTML and partly in the javascript via the DOM (a pain for everyone).
//  Requires prototype.js 1.6.0.
//  Copyright 2008-2010 Sam Graham.

var ajaxTemplate = {

    Version: '1.0.0.2',

    validActions: $w('replace append show hide'),

    applyAction: function ( fragmentNode, actionDef, valOb )
        {
            var i, target, targets, prop, action, val;

            for( i = 0; i < this.validActions.length; i++ )
            {
                if( prop = actionDef.getAttribute(
                    'ajt:' + this.validActions[ i ] ) )
                {
                    action = this.validActions[ i ];
                    break;
                }
            }

            if( !action )
            {
alert( 'unknown action' );
                return;
            }

            val = valOb[ prop ];

            if( !val && ( action == 'replace' || action == 'append' ) )
                return;

//alert( 'looking to ' + action + ' from ' + prop );

            if( targets = actionDef.getAttribute( 'ajt:style' ) )
            {
//var ot = targets;
                targets = fragmentNode.select( targets );
//alert( 'style search for ' + ot + ' found ' + targets );
            }
            else if( targets = actionDef.getAttribute( 'ajt:xpath' ) )
            {
                alert( 'ajaxTemplate.js: xpath targets not yet supported' );
                return;
            }
            else
            {
                //  Default target is element with same ajt:name attribute
                //  as prop
                var attr = '[ajt:name=\'' + prop + '\']';
                targets = fragmentNode.select( attr );
//alert( 'default search for ' +
//  '[ajt:name=\'' + prop + '\']' +
//  ' found ' + target );
            }

//alert( action + ':' + prop + ' found targets ' + targets );
            if( !targets )
                return;

            for( i = 0; i < targets.length; i++ )
            {
                target = $(targets[ i ]);

//alert( 'target.nodeValue = ' + target.nodeValue ); 
//alert( 'target.firstChild = ' + target.firstChild );

                if( action == 'replace' )
                    if( target.nodeName == 'INPUT' )
                        target.value = val;
                    else
                        target.update( val );
                else if( action == 'append' )
                    if( target.nodeName == 'INPUT' )
                        target.value += val;
                    else
                        target.insert( val );
                else if( action == 'show' )
                    if( val )
                        target.show();
                    else
                        target.hide();
                else if( action == 'hide' )
                    if( val )
                        target.hide();
                    else
                        target.show();
            }
        },

    applyActions: function ( fragmentNode, actionsNode, valOb )
        {
            $A($(actionsNode).select( 'LI' )).each(
                function ( el )
                {
                    ajaxTemplate.applyAction( fragmentNode, el, valOb );
                } );
        },

    copyTemplate: function ( containerID, template, valOb )
        {
            var templateNode, fragmentNode, actionsNode;

//alert( 'looking for: #' + containerID + ' [ajt:template=\'' + template + '\']' );
            templateNode = $(containerID).select(
                '[ajt:template=\'' + template + '\']' ).first();
            actionsNode = $(containerID).select(
                '[ajt:actions=\'' + template + '\']' ).first();

//if( templateNode )
//  alert( 'found templateNode' );
//if( actionsNode )
//  alert( 'found actionsNode' );

            if( !templateNode || !actionsNode )
                return;

//alert( 'templateNode ' + templateNode ); alert( templateNode.innerHTML );
//alert( 'actionsNode ' + actionsNode ); alert( actionsNode.innerHTML );

            fragmentNode = templateNode.cloneNode( true );

//alert( "ajt:template is " + fragmentNode.getAttribute( 'ajt:template' ) );
//  This crashes IE7 on the second time through?  Egads...
//    $(fragmentNode).removeAttribute( 'ajt:template' );
//alert( "attr removed" );
//alert( "ajt:template now is " + fragmentNode.getAttribute( 'ajt:template' ) );
            $(fragmentNode).show();

            this.applyActions( fragmentNode, actionsNode, valOb );

            return( fragmentNode );
        }

    };
