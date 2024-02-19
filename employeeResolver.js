const EmployeeModel = require('./models/Employee');

const employeeResolvers = {
  Query: {
    getAllEmployees: async () => {
      try {
        const employees = await EmployeeModel.find();
        return employees;
      } catch (error) {
        throw new Error('Error fetching employees');
      }
    },
    searchEmployeeByEid: async (_, { eid }) => {
      try {
        const employee = await EmployeeModel.findById(eid);
        return employee;
      } catch (error) {
        throw new Error('Employee not found');
      }
    },
  },
  Mutation: {
    addNewEmployee: async (_, { input }) => {
      try {
        if (!input.first_name || !input.last_name || !input.email || !input.gender || !input.salary) {
          throw new Error('All fields are required for adding a new employee.');
        }

        const employee = new EmployeeModel(input);
        await employee.save();
        return employee;
      } catch (error) {
        throw new Error(`Error adding new employee: ${error.message}`);
      }
    },
    updateEmployeeByEid: async (_, { eid, input }) => {
      try {
        const employee = await EmployeeModel.findByIdAndUpdate(eid, input, { new: true });
        return employee;
      } catch (error) {
        throw new Error(`Error updating employee: ${error.message}`);
      }
    },
    deleteEmployeeByEid: async (_, { eid }) => {
      try {
        const employee = await EmployeeModel.findByIdAndDelete(eid);
        return employee;
      } catch (error) {
        throw new Error(`Error deleting employee: ${error.message}`);
      }
    },
  },
};

module.exports = employeeResolvers;
