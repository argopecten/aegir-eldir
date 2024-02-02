<?php

/**
 * Preprocessor for theme_page().
 */
function eldir_preprocess_page(&$variables, $hook) {
  // Prepare the svg URL
  if (strpos($variables['logo'], 'eldir')) {
    $variables['svg_logo'] = str_replace('logo.png', 'images-source/aegir_logo_horizontal.svg', $variables['logo']);
  }

  // Overlay is enabled.
  $variables['overlay'] = (module_exists('overlay') && overlay_get_mode() === 'child');

  $variables['tabs2'] = $variables['tabs'];
  unset($variables['tabs']['#secondary']);
  unset($variables['tabs2']['#primary']);

  // Move the local actions into place of the secondary tabs, for now.
  if (is_array($variables['action_links'])) {
    foreach ($variables['action_links'] as $link) {
      if (!is_array($variables['tabs2']['#secondary'])) {
        $variables['tabs2']['#secondary'] = array();
      }
      $variables['tabs2']['#secondary'][] = $link;
      $variables['tabs2']['#theme'] = 'menu_local_tasks';
    }
    $variables['action_links']['#access'] = FALSE;
  }

  if (!isset($variables['title'])) {
    $variables['title'] = isset($variables['node']) ? $variables['node']->title : drupal_get_title();
  }

  $node = menu_get_object();
  if (!empty($node) && !$variables['overlay']) {
    // Add a node type label on node pages to help users.
    $types = node_type_get_types();
    $type = $node->type;
    if (!empty($types[$type])) {
      $variables['title'] = "<span class='label'>{$types[$type]->name}</span>" . $variables['title'];

    }
  }
}

/**
 * Implements hook_css_alter().
 * @TODO: Do this in .info once http://drupal.org/node/575298 is committed.
 */
function eldir_css_alter(&$css) {
  if (isset($css['modules/overlay/overlay-child.css'])) {
    $css['modules/overlay/overlay-child.css']['data'] = drupal_get_path('theme', 'eldir') . '/overlay-child.css';
  }
}

function eldir_preprocess_html(&$variables, $hook) {
  $node = menu_get_object();
  if (!empty($node)) {
    $type = $node->type;

    $variables['classes_array'][] = " node-page";
    $variables['classes_array'][] = " ntype-{$type}";
  }

  // Add path-based class for a last line of defense
  $current_path = current_path();
  if (!empty($current_path)) {
    $variables['classes_array'][] = ' path-' . drupal_html_class(current_path());
  }

  // Add special body class for error pages
#  if (menu_get_active_item() === 0) {
#    $variables['body_classes'] .= ' error-page';
#  }

}

/**
 * Preprocessor for theme_node().
 */
function eldir_preprocess_node(&$variables, $hook) {

  if (!empty($variables['node'])) {
    // Add a node type label on node pages to help users.
    $types = node_type_get_types();
    $type = $variables['node']->type;
    if (!empty($types[$type])) {
      $variables['title'] = "<span class='label'>{$types[$type]->name}</span>" . $variables['title'];
    }
  }

  if (isset($variables['content']['info']) && is_array($variables['content']['info'])) {
    // Change the rendering of the info area to proper table.
    $variables['content']['info']['#theme'] = 'item_info_listing';
    $variables['content']['info']['#pre_render'][] = 'eldir_info_table_pre_render';
    $variables['content']['info']['#weight'] = 100;

    // Servers (at least) also have info tables _within_ the info area.
    foreach (element_children($variables['content']['info']) as $child) {
      if (isset($variables['content']['info'][$child]['title']['#type']) && $variables['content']['info'][$child]['title']['#type'] == 'item') {
        $variables['content']['info'][$child]['#theme'] = 'item_info_listing';
        $variables['content']['info'][$child]['#pre_render'][] = 'eldir_info_table_pre_render';
      }
    }
  }
}

/**
 * Implements hook_theme().
 */
function eldir_theme() {
  $info = array();

  $info['item_info_listing'] = array(
    'render element' => 'info_listing',
  );

  return $info;
}

/**
 * Theme implementation for a hosting info listing.
 */
function eldir_item_info_listing($variables) {
  $info_listing = $variables['info_listing'];

  if (!isset($info_listing['#items'])) {
    $info_listing['#items'] = array();
  }
  // Sort the items, adding a weight if they don't have one.
  $weight = 0;
  foreach ($info_listing['#items'] as $k => $item) {
    if (!isset($item['weight'])) {
      $weight += 0.001;
      $info_listing['#items'][$k]['weight'] = $weight;
    }
  }
  usort($info_listing['#items'], 'drupal_sort_weight');

  // Add the actual table of items.
  $render['hosting_info_table'] = array(
    '#theme' => 'table',
    '#rows' => array(),
    '#weight' => 1000,
    '#attributes' => array(
      'class' => array(
        'hosting-info-table',
      ),
    ),
  );
  foreach ($info_listing['#items'] as $item) {
    $row = array(
      'no_striping' => TRUE,
      'class' => array('item'),
    );

    $row['data'][] = array(
      'data' => $item['title'],
      'class' => array('item-title'),
    );
    $text = render($item['value']);
    if (isset($item['description'])) {
      $text .= '<div class="item-description">' . render($item['description']) . '</div>';
    }
    $row['data'][] = array(
      'data' => $text,
      'class' => array('item-value'),
    );

    $render['hosting_info_table']['#rows'][] = $row;
  }

  // Move any children of this element over to our new render array.
  foreach (element_children($info_listing) as $child) {
    $render[$child] = $info_listing[$child];
  }

  return render($render);
}

/**
 * Pre render function to process an info item into a hosting info table.
 */
function eldir_info_table_pre_render($element) {
  // Try to move children into the '#items'.
  foreach (element_children($element) as $child) {
    if (isset($element[$child]['#type']) && $element[$child]['#type'] == 'item') {
      if (!empty($element[$child]['#title']) && !empty($element[$child]['#markup'])) {
        $new_item = array(
          'title' => $element[$child]['#title'],
          'value' => $element[$child]['#markup'],
        );
        if (isset($element[$child]['#weight'])) {
          $new_item['weight'] = $element[$child]['#weight'];
        }
        if (isset($element[$child]['#description'])) {
          $new_item['description'] = $element[$child]['#description'];
        }
        $element['#items'][] = $new_item;
        unset($element[$child]);
      }
    }
  }
  return $element;
}

