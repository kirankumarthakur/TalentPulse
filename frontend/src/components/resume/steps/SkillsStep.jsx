import React, { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import ResumeField from "../ResumeField";

const SkillsStep = ({ items = [], onAdd, onRemove }) => {
  const [category, setCategory] = useState("");
  const [name, setName] = useState("");
  const canAdd = category.trim() && name.trim();

  const addSkill = () => {
    if (!canAdd) return;
    onAdd({ category: category.trim(), name: name.trim() });
    setCategory("");
    setName("");
  };

  return (
    <div className="space-y-6">
      <div className="grid items-end gap-4 sm:grid-cols-[0.8fr_1.2fr_auto]">
        <ResumeField
          label="Category"
          onChange={setCategory}
          placeholder="Languages"
          required
          value={category}
        />
        <ResumeField
          label="Skill"
          onChange={setName}
          placeholder="C++, Python, React"
          required
          value={name}
        />
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          className="flex h-11 items-center justify-center gap-2 border-2 border-[#1d3557] px-4 text-sm font-bold hover:bg-[#d7e5ee] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
          disabled={!canAdd}
          onClick={addSkill}
          type="button"
        >
          <FiPlus /> Add
        </motion.button>
      </div>

      {items.length > 0 && (
        <div className="flex flex-wrap gap-3 border-t border-[#c4d4eb] pt-5">
          <AnimatePresence initial={false}>
            {items.map((skill, index) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
                className="flex items-center gap-2 border-2 border-[#457b9d] bg-[#d7e5ee] px-3 py-2 text-sm text-[#1d3557]"
                key={`${skill.category}-${skill.name}-${index}`}
              >
                <span>
                  <span className="font-bold">{skill.category}:</span> {skill.name}
                </span>
                <motion.button
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.85 }}
                  aria-label={`Remove ${skill.name}`}
                  className="text-[#e63946] hover:text-[#99131e]"
                  onClick={() => onRemove(index)}
                  type="button"
                >
                  <FiTrash2 size={15} />
                </motion.button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default SkillsStep;
