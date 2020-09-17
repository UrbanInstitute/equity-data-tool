import csv

cr = csv.reader(open("content/resources.csv"))
qOrder = ["questions","align","evidence","marginalized","impact","risks","consequences","formalize","ahead","fund","takeaways"]
tableString = "<table id = \"resourcesTable\"><thead><tr>"

head = next(cr)
hMap = {}
for i in range(0, len(head)):
# h in head:
    h = head[i]
    hMap[h] = i
    if(h != "Link"):
        if(h == "Geography Name" or h == "Geography Level" or h == "Type" or h == "Topic"):
            tableString += "<th class = \"filter-select\">" + h + "</th>"
        else:
            tableString += "<th>" + h + "</th>"

tableString += "</thead><tbody>"
for row in cr:
    tableString += "<tr>"
    for i in range(0, len(row)):
        c = row[i]
        # print(head[i])
        if(i == 0):
            if row[hMap["Link"]] != "":
                tableString += "<td><a href = \"" + row[hMap["Link"]] + "\" target=\"_blank\">" + c + "</a></td>"
            else:
                tableString += "<td>" + c + "</td>"
        elif(i == hMap["Link"]):
            continue
        elif(i == hMap["Contact"]):
            if c != "":
                tableString += "<td><a href = \"mailto:" + c + "\" target=\"_blank\">" + c + "</a></td>"
            else:
                tableString += "<td>" + c + "</td>"
        elif (i == hMap["Referenced In"]):
            qs = c.split(";")
            tableString += "<td>"
            for q in qs:
                q = q.strip()
                slug = qOrder[int(q)]
                tableString += "<a href = \"index.html#" + slug + "\" target = \"_blank\"><span class = \"resourceTableQ Q" + q+ "\">Q" + q + "</span></a>"
            tableString += "</td>"
        else:
            tableString += "<td>" + c + "</td>"
    tableString += "</tr>"

tableString += "</tbody></table>"

with open("tableSnippet.html", "w") as tableSnippet:
    tableSnippet.write(tableString)
