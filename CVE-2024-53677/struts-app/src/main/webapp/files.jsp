<%@page contentType="text/html; charset=UTF-8" language="java" %>
<%@ taglib prefix="s" uri="/struts-tags" %>
<s:if test="uploadedFileNames.size() > 0">
    업로드 파일명:
    <s:iterator value="uploadedFileNames">
        <li><s:property /></li>
</s:iterator>
</s:if>
<s:else>
    no files.
</s:else>