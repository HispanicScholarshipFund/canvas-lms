# frozen_string_literal: true

#
# Copyright (C) 2023 - present Instructure, Inc.
#
# This file is part of Canvas.
#
# Canvas is free software: you can redistribute it and/or modify it under
# the terms of the GNU Affero General Public License as published by the Free
# Software Foundation, version 3 of the License.
#
# Canvas is distributed in the hope that it will be useful, but WITHOUT ANY
# WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
# A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
# details.
#
# You should have received a copy of the GNU Affero General Public License along
# with this program. If not, see <http://www.gnu.org/licenses/>.

class NewContentMigrationPage
  class << self
    include SeleniumDependencies

    # CSS
    def migration_file_upload_input_id
      "#migrationFileUpload"
    end

    def add_import_queue_button_selector
      '[data-cid="BaseButton Button"]'
    end

    def migration_type_options
      INSTUI_Select_options('[data-testid="select-content-type-dropdown"]')
    end

    # Selectors
    def migration_type_dropdown
      f("#Select_0")
    end

    def migration_type_option_by_id(id)
      f("#" + id)
    end

    def add_import_queue_button
      f('[data-testid="submitMigration"]')
    end

    def clear_button
      f('[data-testid="clear-migration-button"]')
    end

    def selective_import_dropdown
      ff("input[name=selective_import]")
    end

    def all_content_radio
      fxpath('//*[text()="All content"]')
    end

    def specific_content_radio
      fxpath('//*[text()="Select specific content"]')
    end

    def progress_status_label
      f('[data-testid="migrationStatus"]')
    end

    def migration_file_upload_input
      f("#migrationFileUpload")
    end

    def select_content_button
      f('td [data-cid="BaseButton Button"]')
    end

    def all_assignments_checkbox
      f('input[data-testid="checkbox-copy[all_assignments]]"]')
    end

    def select_content_submit_button
      f(".selectContentDialog input[type=submit]")
    end

    def content
      f("#content")
    end

    def course_search_input
      f("#Select_1")
    end

    def course_search_result(id)
      f('#Selectable_1-list > li > [id="' + id + '"]')
    end

    def ui_auto_complete
      f(".ui-autocomplete")
    end

    def course_search_link
      f(".ui-autocomplete li a")
    end

    def course_search_results
      ff("Selectable_1-list > li")
    end

    def course_search_results_visible
      ff("div", fj(".ui-autocomplete li a:visible"))
    end

    def source_link
      f(".migrationProgressItem .sourceLink a")
    end

    def include_completed_courses_checkbox
      f("#include_completed_courses")
    end

    def migration_progress_items
      find_table_rows("Content Migrations")
    end

    def course_select_warning
      f("#courseSelectWarning")
    end

    def module
      f('li.top-level-treeitem[data-type="context_modules"] a.checkbox-caret')
    end

    def submodule
      f('li.top-level-treeitem[data-type="context_modules"] li.normal-treeitem')
    end

    def external_tool_launch_button
      f("button#externalToolLaunch")
    end

    def lti_iframe
      f(".tool_launch")
    end

    def lti_title
      f(".ui-dialog-title")
    end

    def basic_lti_link
      f("#basic_lti_link")
    end

    def file_name_label
      f("#converter .file_name")
    end

    def external_tool_launch
      fxpath('//*[text()="Find a Course"]')
    end

    def lti_select_content
      fxpath('//*[text()="Content"]')
    end

    def date_adjust_checkbox
      fxpath('//*[text()="Adjust events and due dates"]')
    end

    def add_day_substitution_button
      fxpath('//*[@aria-hidden="true" and text()="Substitution"]/ancestor::button')
    end

    def add_day_containers
      ff("#daySubstitution ul > div")
    end

    def old_start_date_input
      find_by_test_id("old_start_date")
    end

    def old_end_date_input
      find_by_test_id("old_end_date")
    end

    def new_start_date_input
      find_by_test_id("new_start_date")
    end

    def new_end_date_input
      find_by_test_id("new_end_date")
    end

    def select_day_substition_range(index, from_weekday, to_weekday)
      click_option("#day-substition-from-#{index}", from_weekday)
      click_option("#day-substition-to-#{index}", to_weekday)
    end
  end
end
