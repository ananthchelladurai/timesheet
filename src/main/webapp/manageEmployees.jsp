<%@ taglib prefix="timeSheet" uri="/WEB-INF/tags/timeSheet.tld" %>
<%@ page import="timeSheet.UtilWeb" %>
<%@ page import="timeSheet.database.entity.Employee" %>
<%@ page import="timeSheet.database.manager.EmployeeManager" %>
<%@ page import="java.util.List" %>
<%--
  User: John Lawrence
  Date: Dec 5, 2010
  Time: 2:10:30 AM
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <% UtilWeb.checkSession(session, out, false, true); %>
    <% EmployeeManager employeeManager = new EmployeeManager(); %>
    <title>PaySystem - Manage Groups</title>
    <style type="text/css">
        @import url('display.css');
    </style>
</head>
<body>
<% out.println(UtilWeb.getMenu(request));%>
<timeSheet:header/>
<h2>Employee Management</h2>

<div>
    <table class="install">
        <%
            List<Employee> employeeList = employeeManager.getEmployeeList();
            for (Employee emp : employeeList) {
        %>
        <tr>
            <td class="value"><%=emp.getName()%></td>
            <td class="action"><a href=<%="editEmployee.jsp?"+Employee.Field.id+ "=" + emp.getId()%>>Edit</a></td>
            <td class="action"><a href=<%="library/deleteEmployee.jsp?"+Employee.Field.id+ "=" + emp.getId()%>>Delete</a></td>
        </tr>
        <%
            }
        %>
    </table>
</div>
<div class="login">
    <a href="editEmployee.jsp">Add</a>
</div>
<timeSheet:footer />
</body>
</html>
