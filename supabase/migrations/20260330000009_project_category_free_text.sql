-- Remove the CHECK constraint on projects.category to allow custom categories.
-- Existing values (residencial, comercial, reforma, fazenda, interiores) remain valid.
ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_category_check;
