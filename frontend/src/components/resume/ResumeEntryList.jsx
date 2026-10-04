import React from "react";
import { AnimatePresence, motion } from "motion/react";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import ResumeField from "./ResumeField";

const ResumeEntryList = ({
  title,
  items,
  fields,
  labels,
  placeholders,
  requiredFields = [],
  dateFields = [],
  multilineField,
  onChange,
  onAdd,
  onRemove,
}) => (
  <div className="space-y-5">
    <AnimatePresence initial={false}>
      {items.map((item, index) => (
        <motion.div
          layout
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.2 }}
          className="border-2 border-[#c4d4eb] bg-[#f1faee] p-5"
          key={`${title}-${index}`}
        >
          <div className="mb-5 flex items-center justify-between">
            <p className="text-sm font-bold text-[#1d3557]">{title} {index + 1}</p>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label={`Remove ${title} ${index + 1}`}
              className="text-[#e63946] hover:text-[#99131e]"
              onClick={() => onRemove(index)}
              type="button"
            >
              <FiTrash2 />
            </motion.button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {fields.map((field, fieldIndex) => (
              <ResumeField
                key={field}
                label={labels[fieldIndex]}
                multiline={field === multilineField}
                onChange={(value) => onChange(index, field, value)}
                placeholder={placeholders[fieldIndex]}
                required={requiredFields.includes(field)}
                type={dateFields.includes(field) ? "date" : "text"}
                value={item[field]}
              />
            ))}
          </div>
        </motion.div>
      ))}
    </AnimatePresence>
    <motion.button
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      className="flex items-center gap-2 border-2 border-[#1d3557] px-4 py-2.5 text-sm font-bold hover:bg-[#d7e5ee]"
      onClick={onAdd}
      type="button"
    >
      <FiPlus /> Add {title.toLowerCase()}
    </motion.button>
  </div>
);

export default ResumeEntryList;
