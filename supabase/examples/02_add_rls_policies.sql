-- Enable Row Level Security on the employee table
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for the employee table
CREATE POLICY "All users can select all employees." 
ON employees 
FOR SELECT 
TO authenticated, anon 
USING (true);

CREATE POLICY "Employees can be inserted by any authenticated user." 
ON employees 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Employees can be updated by user with their own email." 
ON employees 
FOR UPDATE 
TO authenticated 
USING ((select auth.email()) = email) 
WITH CHECK (true);

CREATE POLICY "Employees can be deleted by user with their own email." 
ON employees 
FOR DELETE 
TO authenticated 
USING ((select auth.email()) = email);